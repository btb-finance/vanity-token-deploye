import {task} from 'hardhat/config';
import {getNetworkNameForEid, types} from '@layerzerolabs/devtools-evm-hardhat';
import {EndpointId} from '@layerzerolabs/lz-definitions';
import {addressToBytes32} from '@layerzerolabs/lz-v2-utilities';
import {Options} from '@layerzerolabs/lz-v2-utilities';
import {BigNumberish, BytesLike} from 'ethers';

interface Args {
  amount: string;
  to: string;
  toEid: EndpointId;
}

interface SendParam {
  dstEid: EndpointId; // Destination endpoint ID, represented as a number.
  to: BytesLike; // Recipient address, represented as bytes.
  amountLD: BigNumberish; // Amount to send in local decimals.
  minAmountLD: BigNumberish; // Minimum amount to send in local decimals.
  extraOptions: BytesLike; // Additional options supplied by the caller to be used in the LayerZero message.
  composeMsg: BytesLike; // The composed message for the send() operation.
  oftCmd: BytesLike; // The OFT command to be executed, unused in default OFT implementations.
}

// send tokens from a contract on one network to another
export default task('lz:oft:send', 'Sends tokens from either OFT or OFTAdapter')
  .addParam('to', 'contract address on network B', undefined, types.string)
  .addParam('toeid', 'destination endpoint ID', 40245, types.eid)
  .addParam('amount', 'amount to transfer in token decimals', undefined, types.string)
  .setAction(async (taskArgs: Args, {ethers, deployments}) => {
    const toAddress = taskArgs.to;
    const eidB = taskArgs.toEid;

    // Get the contract factories
    const oftDeployment = await deployments.get('MyOFT');

    const [signer] = await ethers.getSigners();

    // Create contract instances
    const oftContract = new ethers.Contract(oftDeployment.address, oftDeployment.abi, signer);

    const decimals = await oftContract.decimals();
    const amount = ethers.utils.parseUnits(taskArgs.amount, decimals);
    let options = Options.newOptions().addExecutorLzReceiveOption(65000, 0).toBytes();

    // Now you can interact with the correct contract
    const oft = oftContract;

    const sendParam: SendParam = {
      dstEid: eidB,
      to: addressToBytes32(toAddress),
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: options,
      composeMsg: ethers.utils.arrayify('0x'), // Assuming no composed message
      oftCmd: ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
    };
    // Get the quote for the send operation
    const feeQuote = await oft.quoteSend(sendParam, false);
    const nativeFee = feeQuote.nativeFee;

    console.log(
      `sending ${taskArgs.amount} token(s) to network ${getNetworkNameForEid(eidB)} (${eidB})`,
    );

    const ERC20Factory = await ethers.getContractFactory('ERC20');
    const innerTokenAddress = await oft.token();

    // If the token address !== address(this), then this is an OFT Adapter
    if (innerTokenAddress !== oft.address) {
        // If the contract is OFT Adapter, get decimals from the inner token
        const innerToken = ERC20Factory.attach(innerTokenAddress);

        // Approve the amount to be spent by the oft contract
        await innerToken.approve(oftDeployment.address, amount);
    }

    const r = await oft.send(sendParam, {nativeFee, lzTokenFee: ethers.BigNumber.from('0')}, signer.address, {
      value: nativeFee,
    });
    console.log(`Send tx initiated. See: https://layerzeroscan.com/tx/${r.hash}`);
  });