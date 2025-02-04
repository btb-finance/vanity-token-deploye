import {task, types} from 'hardhat/config';
import {getNetworkNameForEid} from '@layerzerolabs/devtools-evm-hardhat';
import {addressToBytes32} from '@layerzerolabs/lz-v2-utilities';
import {Options} from '@layerzerolabs/lz-v2-utilities';
import {BigNumberish, BytesLike} from 'ethers';

interface Args {
  amount: string;
  to: string;
  toEid: number;
}

interface SendParam {
  dstEid: number;
  to: BytesLike;
  amountLD: BigNumberish;
  minAmountLD: BigNumberish;
  extraOptions: BytesLike;
  composeMsg: BytesLike;
  oftCmd: BytesLike;
}

// send tokens from a contract on one network to another
export default task('lz:oft:send', 'Sends tokens from either OFT or OFTAdapter')
  .addParam('to', 'contract address on network B', undefined, types.string)
  .addParam('toeid', 'destination endpoint ID', undefined, types.int)
  .addParam('amount', 'amount to transfer in token decimals', undefined, types.string)
  .setAction(async (taskArgs: Args, {ethers}) => {
    const toAddress = taskArgs.to;
    const eidB = taskArgs.toEid;

    const [signer] = await ethers.getSigners();

    // Create contract instance using the deployed address
    const BTBFinance = await ethers.getContractFactory('BTBFinance');
    const btbContract = BTBFinance.attach('0xB1ca5c3c195EB86956e369011f65B3A7B6E444BB');

    const decimals = await btbContract.decimals();
    const amount = ethers.utils.parseUnits(taskArgs.amount, decimals);
    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toBytes();

    const sendParam: SendParam = {
      dstEid: eidB,
      to: addressToBytes32(toAddress),
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: options,
      composeMsg: ethers.utils.arrayify('0x'),
      oftCmd: ethers.utils.arrayify('0x'),
    };

    // Get the quote for the send operation
    const feeQuote = await btbContract.quoteSend(sendParam, false);
    const nativeFee = feeQuote.nativeFee;

    console.log(
      `Sending ${taskArgs.amount} token(s) to network ${getNetworkNameForEid(eidB)} (${eidB})`,
    );

    const tx = await btbContract.send(
      sendParam,
      {
        nativeFee, 
        lzTokenFee: ethers.BigNumber.from(0)
      },
      signer.address,
      {
        gasLimit: 300000,
        gasPrice: ethers.utils.parseUnits('20', 'gwei'),
        value: nativeFee
      }
    );

    console.log(`Send tx initiated. See: https://layerzeroscan.com/tx/${tx.hash}`);
  });