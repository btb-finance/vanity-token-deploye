import { getAddress } from '@ethersproject/address';
import { hexZeroPad, hexlify, arrayify } from '@ethersproject/bytes';
import base58 from 'bs58';
import { defaultAbiCoder } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { pack } from '@ethersproject/solidity';
import invariant from 'tiny-invariant';
import { keccak256 } from '@ethersproject/keccak256';
export { keccak256 } from '@ethersproject/keccak256';

// src/utils/hex.ts
function hexZeroPadTo32(addr) {
  return hexZeroPad(addr, 32);
}
function bytes32ToEthAddress(bytes32) {
  if (bytes32 instanceof Uint8Array) {
    bytes32 = hexlify(bytes32);
  }
  return getAddress(bytes32.slice(-40));
}
function trim0x(str) {
  return str.replace(/^0x/, "");
}
function addressToBytes32(address) {
  if (isSolanaAddress(address)) {
    return base58.decode(address);
  } else if (address.startsWith("0x") && address.length <= 66) {
    return arrayify(hexZeroPadTo32(address));
  }
  throw new Error("Invalid address");
}
var solanaAddressRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
function isSolanaAddress(address) {
  return solanaAddressRegex.test(address);
}
var aptosAddressRegex = /^(0x)?[0-9a-fA-F]{1,64}$/;
function isAptosAddress(address) {
  return aptosAddressRegex.test(address);
}
var initiaAddressRegex = /^0x[a-fA-F0-9]{1,64}$/;
function isInitiaAddress(address) {
  return initiaAddressRegex.test(address);
}
function isTonAddress(address) {
  const hash = trim0x(address).toLowerCase();
  return /[a-f0-9]+/.test(hash) && hash.length === 64;
}

// src/utils/precrime.ts
var CONFIG_VERSION_OFFSET = 0;
var MAX_BATCH_SIZE_OFFSET = 2;
var NUMBER_OF_PEERS_OFFSET = 10;
var PEERS_OFFSET = 12;
function parsePrecrimeConfig(precrimeConfig) {
  const data = trim0x(precrimeConfig);
  const version = parseInt(data.slice(0, 4), 16);
  if (version === 1) {
    return parsePrecrimeConfigV1(precrimeConfig);
  } else if (version === 2) {
    return parsePrecrimeConfigV2(precrimeConfig);
  }
  throw new Error(`Unsupported precrime config version: ${version}`);
}
function parsePrecrimeConfigV1(precrimeConfig) {
  const data = trim0x(precrimeConfig);
  const version = parseInt(data.slice(0, 4), 16);
  const maxBatchSize = parseInt(data.slice(4, 20), 16);
  const remoteChainsLength = parseInt(data.slice(20, 84), 16);
  const remoteChainsBytes = data.slice(84, 84 + remoteChainsLength * 64);
  const remoteAddressesBytes = data.slice(
    84 + remoteChainsLength * 64,
    84 + remoteChainsLength * 64 + remoteChainsLength * 64
  );
  const remoteChainsBytesArray = [];
  const remoteAddressesBytesArray = [];
  let start = 0;
  let end = 64;
  for (let i = 0; i < remoteChainsLength; i++) {
    remoteChainsBytesArray.push(parseInt(remoteChainsBytes.slice(start, end), 16));
    remoteAddressesBytesArray.push(`0x${remoteAddressesBytes.slice(start, end)}`);
    start += 64;
    end += 64;
  }
  return { version, maxBatchSize, remoteEids: remoteChainsBytesArray, remoteAddresses: remoteAddressesBytesArray };
}
function parsePrecrimeConfigV2(precrimeConfig) {
  const buffer = Buffer.from(trim0x(precrimeConfig), "hex");
  const version = buffer.readUInt16BE(CONFIG_VERSION_OFFSET);
  const maxBatchSize = buffer.readBigUint64BE(MAX_BATCH_SIZE_OFFSET);
  const peers = new Array();
  if (buffer.length > NUMBER_OF_PEERS_OFFSET) {
    const numOfPeers = buffer.readUInt16BE(NUMBER_OF_PEERS_OFFSET);
    for (let i = 0; i < numOfPeers; i++) {
      const offset = PEERS_OFFSET + i * (4 + 2 * 32);
      const eid = buffer.readUInt32BE(offset);
      const preCrimeAddress = "0x" + buffer.slice(offset + 4, offset + 4 + 32).toString("hex");
      const oappAddress = "0x" + buffer.slice(offset + 4 + 32, offset + 4 + 32 + 32).toString("hex");
      peers.push({
        eid,
        preCrimeAddress,
        oappAddress
      });
    }
  }
  return {
    version,
    maxBatchSize,
    peers
  };
}
var parseError = (errorData, intf) => {
  const buildInError = parseBuildInError(errorData);
  if (buildInError !== void 0) {
    return buildInError;
  }
  if (intf) {
    try {
      return intf.parseError(errorData);
    } catch (e) {
      console.error(e);
    }
  }
  return void 0;
};
function parseBuildInError(errorData) {
  if (errorData.startsWith("0x08c379a0")) {
    const content = `0x${errorData.substring(10)}`;
    const reason = defaultAbiCoder.decode(["string"], content);
    return reason[0];
  }
  if (errorData.startsWith("0x4e487b71")) {
    const content = `0x${errorData.substring(10)}`;
    const code = defaultAbiCoder.decode(["uint"], content);
    return code[0];
  }
  if (errorData === "0x") {
    return "";
  }
  return void 0;
}
var OptionType = /* @__PURE__ */ ((OptionType2) => {
  OptionType2[OptionType2["TYPE_1"] = 1] = "TYPE_1";
  OptionType2[OptionType2["TYPE_2"] = 2] = "TYPE_2";
  OptionType2[OptionType2["TYPE_3"] = 3] = "TYPE_3";
  return OptionType2;
})(OptionType || {});
var MAX_UINT_128 = BigNumber.from("0xffffffffffffffffffffffffffffffff");
function optionsType1(_extraGas) {
  const extraGas = BigNumber.from(_extraGas);
  invariant(extraGas.lte(MAX_UINT_128), "extraGas should be less than MAX_UINT_128");
  return pack(["uint16", "uint256"], [1 /* TYPE_1 */, extraGas]);
}
function optionsType2(_extraGas, _dstNativeAmt, _dstNativeAddress) {
  const extraGas = BigNumber.from(_extraGas);
  invariant(extraGas.lte(MAX_UINT_128), "extraGas should be less than MAX_UINT_128");
  const dstNativeAmt = BigNumber.from(_dstNativeAmt);
  invariant(dstNativeAmt.lte(MAX_UINT_128), "dstNativeAmt should be less than MAX_UINT_128");
  return pack(
    ["uint16", "uint256", "uint256", "bytes"],
    [2 /* TYPE_2 */, BigNumber.from(extraGas), BigNumber.from(dstNativeAmt), _dstNativeAddress]
  );
}
var WorkerId = /* @__PURE__ */ ((WorkerId2) => {
  WorkerId2[WorkerId2["EXECUTOR"] = 1] = "EXECUTOR";
  WorkerId2[WorkerId2["VERIFIER"] = 2] = "VERIFIER";
  WorkerId2[WorkerId2["TREASURY"] = 255] = "TREASURY";
  return WorkerId2;
})(WorkerId || {});
var ExecutorOptionType = /* @__PURE__ */ ((ExecutorOptionType2) => {
  ExecutorOptionType2[ExecutorOptionType2["LZ_RECEIVE"] = 1] = "LZ_RECEIVE";
  ExecutorOptionType2[ExecutorOptionType2["NATIVE_DROP"] = 2] = "NATIVE_DROP";
  ExecutorOptionType2[ExecutorOptionType2["COMPOSE"] = 3] = "COMPOSE";
  ExecutorOptionType2[ExecutorOptionType2["ORDERED"] = 4] = "ORDERED";
  ExecutorOptionType2[ExecutorOptionType2["LZ_READ"] = 5] = "LZ_READ";
  return ExecutorOptionType2;
})(ExecutorOptionType || {});
var VerifierOptionType = /* @__PURE__ */ ((VerifierOptionType2) => {
  VerifierOptionType2[VerifierOptionType2["PRECRIME"] = 1] = "PRECRIME";
  return VerifierOptionType2;
})(VerifierOptionType || {});
var Options = class _Options {
  workerOptions = [];
  // dissuade public instantiation
  constructor() {
  }
  /**
   * Create a new options instance.
   */
  static newOptions() {
    return new _Options();
  }
  /**
   * Create an options instance from a hex string.
   * @param {string} optionsHex The hex string to decode.
   */
  static fromOptions(optionsHex) {
    const options = new _Options();
    const optionsBytes = arrayify(optionsHex);
    const optionsType = BigNumber.from(optionsBytes.slice(0, 2)).toNumber();
    if (optionsType === 3 /* TYPE_3 */) {
      let cursor = 2;
      while (cursor < optionsBytes.byteLength) {
        const workerId = BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
        cursor += 1;
        const size = BigNumber.from(optionsBytes.slice(cursor, cursor + 2)).toNumber();
        cursor += 2;
        if (workerId === 1 /* EXECUTOR */) {
          const optionType = BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
          cursor += 1;
          const params = optionsBytes.slice(cursor, cursor + size - 1);
          cursor += size - 1;
          options.addOption(workerId, { type: optionType, params: hexlify(params) });
        } else if (workerId === 2 /* VERIFIER */) {
          const verifierIdx = BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
          cursor += 1;
          const optionType = BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
          cursor += 1;
          const params = optionsBytes.slice(cursor, cursor + size - 2);
          cursor += size - 2;
          const option = {
            type: optionType,
            index: verifierIdx,
            params: hexlify(params)
          };
          options.addOption(workerId, option);
        }
      }
    } else if (optionsType === 2 /* TYPE_2 */) {
      const extraGas = BigNumber.from(optionsBytes.slice(2, 34)).toBigInt();
      const dstNativeAmt = BigNumber.from(optionsBytes.slice(34, 66)).toBigInt();
      const dstNativeAddress = hexlify(optionsBytes.slice(66, optionsBytes.byteLength));
      options.addExecutorLzReceiveOption(extraGas).addExecutorNativeDropOption(dstNativeAmt, dstNativeAddress);
    } else if (optionsType === 1 /* TYPE_1 */) {
      const extraGas = BigNumber.from(optionsBytes.slice(2, 34)).toBigInt();
      options.addExecutorLzReceiveOption(extraGas);
    }
    return options;
  }
  /**
   * Add ExecutorOptionType.LZ_RECEIVE option.
   * @param {GasLimit} gasLimit
   * @param {NativeDrop} nativeDrop
   */
  addExecutorLzReceiveOption(gasLimit, nativeDrop = 0) {
    const gasLimitBN = BigNumber.from(gasLimit);
    invariant(gasLimitBN.lte(MAX_UINT_128), "gasLimit shouldn't be greater than MAX_UINT_128");
    const nativeDropBN = BigNumber.from(nativeDrop);
    invariant(nativeDropBN.lte(MAX_UINT_128), "value shouldn't be greater than MAX_UINT_128");
    this.addOption(1 /* EXECUTOR */, {
      type: 1 /* LZ_RECEIVE */,
      params: nativeDropBN.eq(0) ? pack(["uint128"], [gasLimitBN]) : pack(["uint128", "uint128"], [gasLimitBN, nativeDropBN])
    });
    return this;
  }
  /**
   * Add ExecutorOptionType.NATIVE_DROP option.
   * @param {NativeDrop} nativeDrop
   * @param {string} receiver
   */
  addExecutorNativeDropOption(nativeDrop, receiver) {
    const amountBN = BigNumber.from(nativeDrop);
    invariant(amountBN.lte(MAX_UINT_128), "nativeDrop shouldn't be greater than MAX_UINT_128");
    this.addOption(1 /* EXECUTOR */, {
      type: 2 /* NATIVE_DROP */,
      params: pack(["uint128", "bytes32"], [amountBN, addressToBytes32(receiver)])
    });
    return this;
  }
  /**
   * Add ExecutorOptionType.COMPOSE option.
   * @param {number} index
   * @param {GasLimit} gasLimit
   * @param {NativeDrop} nativeDrop
   */
  addExecutorComposeOption(index, gasLimit, nativeDrop = 0) {
    const gasLimitBN = BigNumber.from(gasLimit);
    invariant(gasLimitBN.lte(MAX_UINT_128), "gasLimit shouldn't be greater than MAX_UINT_128");
    const nativeDropBN = BigNumber.from(nativeDrop);
    invariant(nativeDropBN.lte(MAX_UINT_128), "nativeDrop shouldn't be greater than MAX_UINT_128");
    const option = nativeDropBN.gt(0) ? {
      type: 3 /* COMPOSE */,
      params: pack(["uint16", "uint128", "uint128"], [index, gasLimitBN, nativeDropBN])
    } : {
      type: 3 /* COMPOSE */,
      params: pack(["uint16", "uint128"], [index, gasLimitBN])
    };
    this.addOption(1 /* EXECUTOR */, option);
    return this;
  }
  /**
   * Add ExecutorOptionType.ORDERED option.
   *
   * @returns {this} The options instance.
   */
  addExecutorOrderedExecutionOption() {
    this.addOption(1 /* EXECUTOR */, {
      type: 4 /* ORDERED */,
      params: "0x"
    });
    return this;
  }
  /**
   * Add ExecutorOptionType.LZ_READ option.
   *
   * @param {GasLimit} gasLimit - The gas limit.
   * @param {DataSize} dataSize - The data size.
   * @param {NativeDrop} [nativeDrop=0] - The native drop.
   * @returns {this} The options instance.
   */
  addExecutorLzReadOption(gasLimit, dataSize, nativeDrop = 0) {
    const gasLimitBN = BigNumber.from(gasLimit);
    const dataSizeBN = BigNumber.from(dataSize);
    const nativeDropBN = BigNumber.from(nativeDrop);
    this.addOption(1 /* EXECUTOR */, {
      type: 5 /* LZ_READ */,
      params: nativeDropBN.eq(0) ? pack(["uint128", "uint32"], [gasLimitBN, dataSizeBN]) : pack(["uint128", "uint32", "uint128"], [gasLimitBN, dataSizeBN, nativeDropBN])
    });
    return this;
  }
  /**
   * Add VerifierOptionType.PRECRIME option.
   *
   * @param {number} verifierIdx - The verifier index.
   * @returns {this} The options instance.
   */
  addVerifierPrecrimeOption(verifierIdx) {
    const option = {
      type: 1 /* PRECRIME */,
      index: verifierIdx,
      params: "0x"
    };
    this.addOption(2 /* VERIFIER */, option);
    return this;
  }
  /**
   * Serialize Options to hex string.
   *
   * @returns {string} The serialized hex string.
   */
  toHex() {
    let hex = pack(["uint16"], [3 /* TYPE_3 */]);
    this.workerOptions.forEach((w) => {
      for (const option of w.options) {
        if (w.workerId === 1 /* EXECUTOR */) {
          hex += trim0x(
            pack(
              ["uint8", "uint16", "uint8", "bytes"],
              [w.workerId, trim0x(option.params).length / 2 + 1, option.type, option.params]
            )
          );
        } else if (w.workerId === 2 /* VERIFIER */) {
          const verifierOption = option;
          hex += trim0x(
            pack(
              ["uint8", "uint16", "uint8", "uint8", "bytes"],
              [
                w.workerId,
                trim0x(option.params).length / 2 + 2,
                verifierOption.index,
                verifierOption.type,
                verifierOption.params
              ]
            )
          );
        }
      }
    });
    return hex;
  }
  /**
   * Serialize Options to Uint8Array.
   *
   * @returns {Uint8Array} The serialized Uint8Array.
   */
  toBytes() {
    return arrayify(this.toHex());
  }
  /**
   * Adds an option to the specified worker.
   *
   * @param {number} workerId - The ID of the worker.
   * @param {Option} option - The option to add.
   */
  addOption(workerId, option) {
    const worker = this.workerOptions.find((w) => w.workerId === workerId);
    if (worker) {
      worker.options.push(option);
    } else {
      this.workerOptions.push({ workerId, options: [option] });
    }
  }
  /**
   * Decode ExecutorOptionType.LZ_RECEIVE option. Returns undefined if the option is not present.
   *
   * @returns {ExecutorLzReceiveOption | undefined} The decoded option or undefined if not present.
   */
  decodeExecutorLzReceiveOption() {
    let options = this.findOptions(1 /* EXECUTOR */, 1 /* LZ_RECEIVE */);
    if (options === void 0 || Array.isArray(options) && options.length === 0) {
      return;
    }
    let totalGas = BigNumber.from(0).toBigInt();
    let totalValue = BigNumber.from(0).toBigInt();
    options = Array.isArray(options) ? options : [options];
    for (const option of options) {
      const buffer = Buffer.from(trim0x(option.params), "hex");
      const gas = BigNumber.from(buffer.subarray(0, 16)).toBigInt();
      const value = BigNumber.from(buffer.length === 16 ? 0 : buffer.subarray(16, 32)).toBigInt();
      totalGas = totalGas + gas;
      totalValue = totalValue + value;
    }
    return { gas: totalGas, value: totalValue };
  }
  /**
   * Decode ExecutorOptionType.NATIVE_DROP options. Returns undefined if the options is not present.
   *
   * @returns {ExecutorNativeDropOption} The decoded options.
   */
  decodeExecutorNativeDropOption() {
    const options = this.findOptions(1 /* EXECUTOR */, 2 /* NATIVE_DROP */);
    if (!options || options.length === 0) {
      return [];
    }
    const results = options.reduce((acc, cur) => {
      const buffer = Buffer.from(trim0x(cur.params), "hex");
      const amount = BigNumber.from(buffer.subarray(0, 16)).toBigInt();
      const receiver = hexlify(buffer.subarray(16, 48));
      if (receiver in acc) {
        acc[receiver].amount = acc[receiver].amount + amount;
      } else {
        acc[receiver] = { amount, receiver };
      }
      return acc;
    }, {});
    return Object.values(results);
  }
  /**
   * Decode ExecutorOptionType.COMPOSE options. Returns undefined if the options is not present.
   *
   * @returns {ComposeOption} The decoded options.
   */
  decodeExecutorComposeOption() {
    const options = this.findOptions(1 /* EXECUTOR */, 3 /* COMPOSE */);
    if (!options || options.length === 0) {
      return [];
    }
    const results = options.reduce(
      (acc, cur) => {
        const buffer = Buffer.from(trim0x(cur.params), "hex");
        const index = BigNumber.from(buffer.subarray(0, 2)).toNumber();
        const gas = BigNumber.from(buffer.subarray(2, 18)).toBigInt();
        const value = (buffer.length === 34 ? BigNumber.from(buffer.subarray(18, 34)) : BigNumber.from(0)).toBigInt();
        if (index in acc) {
          acc[index].gas = acc[index].gas + gas;
          acc[index].value = acc[index].value + value;
        } else {
          acc[index] = { index, gas, value };
        }
        return acc;
      },
      {}
    );
    return Object.values(results);
  }
  /**
   * Decode ExecutorOptionType.ORDERED options. Returns undefined if the options is not present.
   *
   * @returns {boolean} True if the option is present, false otherwise.
   */
  decodeExecutorOrderedExecutionOption() {
    const option = this.findOptions(1 /* EXECUTOR */, 4 /* ORDERED */);
    return option !== void 0;
  }
  /**
   * Decodes ExecutorOptionType.LZ_READ options. Returns undefined if the option is not present.
   *
   * @returns {ExecutorLzReadOption | undefined} The decoded ExecutorLzReadOption or undefined if not present.
   */
  decodeExecutorLzReadOption() {
    let options = this.findOptions(1 /* EXECUTOR */, 5 /* LZ_READ */);
    if (options === void 0 || Array.isArray(options) && options.length === 0) {
      return void 0;
    }
    let totalGas = BigNumber.from(0).toBigInt();
    let dataSize = BigNumber.from(0).toBigInt();
    let totalValue = BigNumber.from(0).toBigInt();
    options = Array.isArray(options) ? options : [options];
    for (const option of options) {
      const buffer = Buffer.from(trim0x(option.params), "hex");
      const gas = BigNumber.from(buffer.subarray(0, 16)).toBigInt();
      const size = BigNumber.from(buffer.subarray(16, 20)).toBigInt();
      const value = BigNumber.from(buffer.length === 20 ? 0 : buffer.subarray(20, 36)).toBigInt();
      totalGas = totalGas + gas;
      dataSize = dataSize + size;
      totalValue = totalValue + value;
    }
    return { gas: totalGas, dataSize, value: totalValue };
  }
  /**
   * Finds options for a given worker and option type.
   *
   * @param {number} workerId - The ID of the worker.
   * @param {number} optionType - The type of the option.
   * @returns {Option[] | Option | undefined} The found options or undefined if not present.
   */
  findOptions(workerId, optionType) {
    const worker = this.workerOptions.find((w) => w.workerId === workerId);
    if (worker) {
      if (optionType === 4 /* ORDERED */) {
        return worker.options.find((o) => o.type === optionType);
      }
      return worker.options.filter((o) => o.type === optionType);
    }
  }
  /**
   * Finds a VerifierOption by verifier index and option type. Returns undefined if the option is not present.
   *
   * @param {number} verifierIdx - The index of the verifier.
   * @param {number} optionType - The type of the option.
   * @returns {VerifierOption | undefined} The found VerifierOption or undefined if not present.
   */
  findVerifierOption(verifierIdx, optionType) {
    const worker = this.workerOptions.find((w) => w.workerId === 2 /* VERIFIER */);
    if (worker) {
      const opt = worker.options.find((o) => o.type === optionType && o.index === verifierIdx);
      if (opt) {
        return opt;
      }
    }
  }
};

// src/model/packet.ts
function packetToMessageOrigin(packet) {
  return {
    srcEid: packet.srcEid,
    sender: packet.sender,
    nonce: packet.nonce
  };
}
var PACKET_VERSION_OFFSET = 0;
var NONCE_OFFSET = 1;
var SRC_CHAIN_OFFSET = 9;
var SRC_ADDRESS_OFFSET = 13;
var DST_CHAIN_OFFSET = 45;
var DST_ADDRESS_OFFSET = 49;
var GUID_OFFSET = 81;
var MESSAGE_OFFSET = 113;
var PacketV1Codec = class _PacketV1Codec {
  /**
   * Buffer to hold the encoded packet data.
   */
  buffer;
  /**
   * Create a PacketV1Codec instance from an encoded payload string.
   *
   * @param {string | Uint8Array | Packet} payload - The encoded payload string.
   * @returns A new PacketV1Codec instance.
   */
  static from(payload) {
    if (typeof payload === "object") {
      if (payload instanceof Uint8Array) {
        return _PacketV1Codec.fromBytes(payload);
      }
      return new _PacketV1Codec(_PacketV1Codec.encode(payload));
    }
    return new _PacketV1Codec(payload);
  }
  /**
   * Create a PacketV1Codec instance from a byte array.
   *
   * @param payload - The byte array representing the payload.
   * @returns A new PacketV1Codec instance.
   */
  static fromBytes(payload) {
    return new _PacketV1Codec("0x" + Buffer.from(payload).toString("hex"));
  }
  /**
   * Constructor for the PacketV1Codec class.
   *
   * @param payloadEncoded - The encoded payload string.
   */
  constructor(payloadEncoded) {
    this.buffer = Buffer.from(trim0x(payloadEncoded), "hex");
  }
  /**
   * Encode a packet to a hex string.
   *
   * @param packet - The packet to encode.
   * @returns The encoded packet as a hex string.
   */
  static encode(packet) {
    const buff = this.encodeBytes(packet);
    return "0x" + Buffer.from(buff).toString("hex");
  }
  /**
   * Encode a packet to a Uint8Array.
   *
   * @param packet - The packet to encode.
   * @returns The encoded packet as a Uint8Array.
   */
  static encodeBytes(packet) {
    const message = trim0x(packet.message);
    const buffer = Buffer.alloc(MESSAGE_OFFSET + message.length / 2);
    buffer.writeUInt8(packet.version, PACKET_VERSION_OFFSET);
    buffer.writeBigUInt64BE(BigInt(packet.nonce), NONCE_OFFSET);
    buffer.writeUInt32BE(packet.srcEid, SRC_CHAIN_OFFSET);
    buffer.write(Buffer.from(addressToBytes32(packet.sender)).toString("hex"), SRC_ADDRESS_OFFSET, 32, "hex");
    buffer.writeUInt32BE(packet.dstEid, DST_CHAIN_OFFSET);
    buffer.write(Buffer.from(addressToBytes32(packet.receiver)).toString("hex"), DST_ADDRESS_OFFSET, 32, "hex");
    buffer.write(trim0x(packet.guid), GUID_OFFSET, 32, "hex");
    buffer.write(message, MESSAGE_OFFSET, message.length / 2, "hex");
    return new Uint8Array(buffer);
  }
  /**
   * Get the version of the packet.
   *
   * @returns The version of the packet.
   */
  version() {
    return this.buffer.readUInt8(PACKET_VERSION_OFFSET);
  }
  /**
   * Get the nonce of the packet.
   *
   * @returns The nonce of the packet as a string.
   */
  nonce() {
    return this.buffer.readBigUint64BE(NONCE_OFFSET).toString();
  }
  /**
   * Get the source chain ID of the packet.
   *
   * @returns The source chain ID of the packet.
   */
  srcEid() {
    return this.buffer.readUint32BE(SRC_CHAIN_OFFSET);
  }
  /**
   * Get the sender address of the packet.
   *
   * @returns The sender address of the packet.
   */
  sender() {
    return "0x" + this.buffer.slice(SRC_ADDRESS_OFFSET, DST_CHAIN_OFFSET).toString("hex");
  }
  /**
   * Get the sender address in B20 format.
   *
   * @returns The sender address in B20 format.
   */
  senderAddressB20() {
    return bytes32ToEthAddress(this.sender());
  }
  /**
   * Get the destination chain ID of the packet.
   *
   * @returns The destination chain ID of the packet.
   */
  dstEid() {
    return this.buffer.readUint32BE(DST_CHAIN_OFFSET);
  }
  /**
   * Get the receiver address of the packet.
   *
   * @returns The receiver address of the packet.
   */
  receiver() {
    return "0x" + this.buffer.slice(DST_ADDRESS_OFFSET, GUID_OFFSET).toString("hex");
  }
  /**
   * Get the receiver address in B20 format.
   *
   * @returns The receiver address in B20 format.
   */
  receiverAddressB20() {
    return bytes32ToEthAddress(this.receiver());
  }
  /**
   * Get the GUID of the packet.
   *
   * @returns The GUID of the packet.
   */
  guid() {
    return "0x" + this.buffer.slice(GUID_OFFSET, MESSAGE_OFFSET).toString("hex");
  }
  /**
   * Get the message of the packet.
   *
   * @returns The message of the packet.
   */
  message() {
    return "0x" + this.buffer.slice(MESSAGE_OFFSET).toString("hex");
  }
  /**
   * Get the hash of the payload.
   *
   * @returns The hash of the payload.
   */
  payloadHash() {
    return keccak256(this.payload());
  }
  /**
   * Get the payload of the packet.
   *
   * @returns The payload of the packet.
   */
  payload() {
    return "0x" + this.buffer.slice(GUID_OFFSET).toString("hex");
  }
  /**
   * Get the header of the packet.
   *
   * @returns The header of the packet.
   */
  header() {
    return "0x" + this.buffer.slice(0, GUID_OFFSET).toString("hex");
  }
  /**
   * Get the hash of the header.
   *
   * @returns The hash of the header.
   */
  headerHash() {
    return keccak256(this.header());
  }
  /**
   * Deserialize packet from hex string.
   *
   * @deprecated Use toPacket instead.
   * @returns The deserialized packet.
   */
  decode() {
    return this.toPacket();
  }
  /**
   * Convert the encoded data to a Packet object.
   *
   * @returns The Packet object.
   */
  toPacket() {
    return {
      version: this.version(),
      nonce: this.nonce(),
      srcEid: this.srcEid(),
      sender: this.sender(),
      dstEid: this.dstEid(),
      receiver: this.receiver(),
      guid: this.guid(),
      message: this.message(),
      // derived
      payload: this.payload()
    };
  }
};
function calculateGuid(packetHead) {
  return keccak256(
    pack(
      ["uint64", "uint32", "bytes32", "uint32", "bytes32"],
      [
        BigNumber.from(packetHead.nonce),
        packetHead.srcEid,
        addressToBytes32(packetHead.sender),
        packetHead.dstEid,
        addressToBytes32(packetHead.receiver)
      ]
    )
  );
}

// src/codec/packet-serializer.ts
var PacketSerializer = class {
  /**
   * Serializes a Packet object to a string.
   *
   * @param {Packet} packet - The packet to serialize.
   * @returns {string} The serialized packet as a string.
   */
  static serialize(packet) {
    return PacketV1Codec.encode(packet);
  }
  /**
   * Serializes a Packet object to a Uint8Array.
   *
   * @param {Packet} packet - The packet to serialize.
   * @returns {Uint8Array} The serialized packet as a Uint8Array.
   */
  static serializeBytes(packet) {
    return PacketV1Codec.encodeBytes(packet);
  }
  /**
   * Deserializes a Uint8Array or string to a Packet object.
   *
   * @param {Uint8Array | string} bytesLike - The bytes or string to deserialize.
   * @returns {Packet} The deserialized Packet object.
   */
  static deserialize(bytesLike) {
    let codec;
    if (bytesLike instanceof Uint8Array) {
      codec = PacketV1Codec.fromBytes(bytesLike);
    } else {
      codec = PacketV1Codec.from(bytesLike);
    }
    return codec.toPacket();
  }
};

// src/commandCodec/commandCodec.ts
var Codec = class {
  byteLength;
  /**
   * Creates an instance of the Codec class.
   */
  constructor() {
    this.byteLength = 0;
  }
  /**
   * Gets the byte length of the codec.
   *
   * @returns {number} The byte length.
   */
  getByteLength() {
    return this.byteLength;
  }
  /**
   * Gets the hex length of the codec.
   *
   * @returns {number} The hex length.
   */
  getHexLength() {
    return this.byteLength * 2;
  }
  /**
   * Decodes a hex string to a codec.
   *
   * @param {string} hex - The hex string to decode.
   * @returns {Codec} The decoded codec.
   * @throws {Error} If the method is not implemented.
   */
  static decode(hex) {
    throw new Error("Not implemented");
  }
};
var TimestampBlockConfiguration = /* @__PURE__ */ ((TimestampBlockConfiguration2) => {
  TimestampBlockConfiguration2[TimestampBlockConfiguration2["Timestamp"] = 0] = "Timestamp";
  TimestampBlockConfiguration2[TimestampBlockConfiguration2["BlockNumber"] = 1] = "BlockNumber";
  return TimestampBlockConfiguration2;
})(TimestampBlockConfiguration || {});
var ResolverType = /* @__PURE__ */ ((ResolverType2) => {
  ResolverType2[ResolverType2["SingleViewFunctionEVMCall"] = 1] = "SingleViewFunctionEVMCall";
  return ResolverType2;
})(ResolverType || {});
var ComputeSetting = /* @__PURE__ */ ((ComputeSetting2) => {
  ComputeSetting2[ComputeSetting2["OnlyMap"] = 0] = "OnlyMap";
  ComputeSetting2[ComputeSetting2["OnlyReduce"] = 1] = "OnlyReduce";
  ComputeSetting2[ComputeSetting2["MapReduce"] = 2] = "MapReduce";
  return ComputeSetting2;
})(ComputeSetting || {});
var ComputeType = /* @__PURE__ */ ((ComputeType2) => {
  ComputeType2[ComputeType2["SingleViewFunctionEVMCall"] = 1] = "SingleViewFunctionEVMCall";
  return ComputeType2;
})(ComputeType || {});
var Header = class _Header extends Codec {
  globalVersion;
  // 2 bytes
  appCommandLabel;
  // 2 bytes
  requestCount;
  // 2 bytes
  static GLOBAL_VERSION_BYTES = 2;
  static APP_COMMAND_LABEL_BYTES = 2;
  static REQUEST_COUNT_BYTES = 2;
  /**
   * Creates an instance of the Header class.
   *
   * @param {number} globalVersion - The global version.
   * @param {string} appCommandLabel - The application command label.
   * @param {number} requestCount - The number of requests.
   */
  constructor(globalVersion, appCommandLabel, requestCount) {
    super();
    this.globalVersion = globalVersion;
    this.appCommandLabel = appCommandLabel;
    this.requestCount = requestCount;
    this.byteLength = _Header.GLOBAL_VERSION_BYTES + _Header.APP_COMMAND_LABEL_BYTES + _Header.REQUEST_COUNT_BYTES;
  }
  /**
   * Encodes the header to a hex string.
   *
   * @returns {string} The encoded hex string.
   */
  encode() {
    const globalVersionHex = numberToHex(this.globalVersion, _Header.GLOBAL_VERSION_BYTES);
    const appCommandLabelHex = this.appCommandLabel.padStart(bytesToHexLength(_Header.APP_COMMAND_LABEL_BYTES), "0");
    const requestCountHex = numberToHex(this.requestCount, _Header.REQUEST_COUNT_BYTES);
    return globalVersionHex + appCommandLabelHex + requestCountHex;
  }
  /**
   * Decodes a hex string to a header.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} [offset] - The offset to start decoding from.
   * @returns {Header} The decoded header.
   */
  static decode(hex, offset) {
    let internalOffset = offset ?? 0;
    const globalVersion = hexToNumber(sliceHex(hex, internalOffset, _Header.GLOBAL_VERSION_BYTES));
    internalOffset += bytesToHexLength(_Header.GLOBAL_VERSION_BYTES);
    const appCommandLabel = sliceHex(hex, internalOffset, _Header.APP_COMMAND_LABEL_BYTES);
    internalOffset += bytesToHexLength(_Header.APP_COMMAND_LABEL_BYTES);
    const requestCount = hexToNumber(sliceHex(hex, internalOffset, _Header.REQUEST_COUNT_BYTES));
    return new _Header(globalVersion, appCommandLabel, requestCount);
  }
};
var RequestHeader = class _RequestHeader extends Codec {
  requestVersion;
  // 1 byte
  appRequestLabel;
  // 2 bytes (hex or string)
  resolverType;
  // 2 bytes
  requestSize;
  // 2 bytes
  static REQUEST_VERSION_BYTES = 1;
  static APP_REQUEST_LABEL_BYTES = 2;
  static RESOLVER_TYPE_BYTES = 2;
  static REQUEST_SIZE_BYTES = 2;
  /**
   * Creates an instance of the RequestHeader class.
   *
   * @param {number} requestVersion - The request version.
   * @param {string} appRequestLabel - The application request label.
   * @param {ResolverType} resolverType - The resolver type.
   * @param {number} requestSize - The request size.
   */
  constructor(requestVersion, appRequestLabel, resolverType, requestSize) {
    super();
    this.requestVersion = requestVersion;
    this.appRequestLabel = appRequestLabel;
    this.resolverType = resolverType;
    this.requestSize = requestSize;
    this.byteLength = _RequestHeader.REQUEST_VERSION_BYTES + _RequestHeader.APP_REQUEST_LABEL_BYTES + _RequestHeader.RESOLVER_TYPE_BYTES + _RequestHeader.REQUEST_SIZE_BYTES;
  }
  /**
   * Encodes the request header to a hex string.
   *
   * @returns {string} The encoded hex string.
   */
  encode() {
    const requestVersionHex = numberToHex(this.requestVersion, _RequestHeader.REQUEST_VERSION_BYTES);
    const appRequestLabelHex = this.appRequestLabel.padStart(
      bytesToHexLength(_RequestHeader.APP_REQUEST_LABEL_BYTES),
      "0"
    );
    const resolverTypeHex = numberToHex(this.resolverType, _RequestHeader.RESOLVER_TYPE_BYTES);
    const requestSizeHex = numberToHex(this.requestSize, _RequestHeader.REQUEST_SIZE_BYTES);
    return requestVersionHex + appRequestLabelHex + resolverTypeHex + requestSizeHex;
  }
  /**
   * Decodes a hex string to a request header.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} [offset] - The offset to start decoding from.
   * @returns {RequestHeader} The decoded request header.
   */
  static decode(hex, offset) {
    let internalOffset = offset ?? 0;
    const requestVersion = hexToNumber(sliceHex(hex, internalOffset, _RequestHeader.REQUEST_VERSION_BYTES));
    internalOffset += bytesToHexLength(_RequestHeader.REQUEST_VERSION_BYTES);
    const appRequestLabel = sliceHex(hex, internalOffset, _RequestHeader.APP_REQUEST_LABEL_BYTES);
    internalOffset += bytesToHexLength(_RequestHeader.APP_REQUEST_LABEL_BYTES);
    const resolverType = hexToNumber(sliceHex(hex, internalOffset, _RequestHeader.RESOLVER_TYPE_BYTES));
    internalOffset += bytesToHexLength(_RequestHeader.RESOLVER_TYPE_BYTES);
    const requestSize = hexToNumber(sliceHex(hex, internalOffset, _RequestHeader.REQUEST_SIZE_BYTES));
    return new _RequestHeader(requestVersion, appRequestLabel, resolverType, requestSize);
  }
};
var EVMBase = class _EVMBase extends Codec {
  targetEid;
  // 4 bytes
  timestampBlockFlag;
  // 1 byte
  blockConfirmations;
  // 2 bytes
  to;
  // 20 bytes (hex or string)
  timestamp;
  // 8 bytes (if timestampBlockFlag indicates Unix timestamp)
  blockNumber;
  // 8 bytes (if timestampBlockFlag indicates block number)
  static TARGET_EID_BYTES = 4;
  static TIMESTAMP_BLOCK_FLAG_BYTES = 1;
  static BLOCK_CONFIRMATIONS_BYTES = 2;
  static TO_BYTES = 20;
  static TIMESTAMP_BYTES = 8;
  static BLOCK_NUMBER_BYTES = 8;
  /**
   * Creates an instance of the EVMBase class.
   *
   * @param {number} targetEid - The target endpoint ID.
   * @param {TimestampBlockConfiguration} timestampBlockFlag - The timestamp block configuration.
   * @param {number} blockConfirmations - The number of block confirmations.
   * @param {string} to - The recipient address.
   * @param {bigint} [timestamp] - The timestamp.
   * @param {bigint} [blockNumber] - The block number.
   */
  constructor(targetEid, timestampBlockFlag, blockConfirmations, to, timestamp, blockNumber) {
    super();
    this.targetEid = targetEid;
    this.timestampBlockFlag = timestampBlockFlag;
    this.blockConfirmations = blockConfirmations;
    this.to = to;
    this.timestamp = timestamp;
    this.blockNumber = blockNumber;
    this.byteLength = _EVMBase.TARGET_EID_BYTES + _EVMBase.TIMESTAMP_BLOCK_FLAG_BYTES + _EVMBase.BLOCK_CONFIRMATIONS_BYTES + _EVMBase.TO_BYTES + (timestamp !== void 0 ? _EVMBase.TIMESTAMP_BYTES : 0) + (blockNumber !== void 0 ? _EVMBase.BLOCK_NUMBER_BYTES : 0);
  }
  /**
   * Encodes the EVM base to a hex string.
   *
   * @returns {string} The encoded hex string.
   */
  encode() {
    const targetEidHex = numberToHex(this.targetEid, _EVMBase.TARGET_EID_BYTES);
    const timestampBlockFlagHex = numberToHex(this.timestampBlockFlag, _EVMBase.TIMESTAMP_BLOCK_FLAG_BYTES);
    const blockNumberHex = this.blockNumber !== void 0 ? bigIntToHex(this.blockNumber, _EVMBase.BLOCK_NUMBER_BYTES) : void 0;
    const timestampHex = this.timestamp !== void 0 ? bigIntToHex(this.timestamp, _EVMBase.TIMESTAMP_BYTES) : void 0;
    if (timestampHex !== void 0 && blockNumberHex !== void 0) {
      throw new Error("Cannot have both timestamp and block number");
    }
    const blockConfirmationsHex = numberToHex(this.blockConfirmations, _EVMBase.BLOCK_CONFIRMATIONS_BYTES);
    const toHex = this.to.padStart(bytesToHexLength(_EVMBase.TO_BYTES), "0");
    const blockOrTimestampHex = blockNumberHex ?? timestampHex;
    if (blockOrTimestampHex === void 0) {
      throw new Error("Either block number or timestamp must be set");
    }
    return targetEidHex + timestampBlockFlagHex + blockOrTimestampHex + blockConfirmationsHex + toHex;
  }
  /**
   * Decodes a hex string to an EVM base.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} [offset] - The offset to start decoding from.
   * @returns {EVMBase} The decoded EVM base.
   */
  static decode(hex, offset) {
    let internalOffset = offset ?? 0;
    const targetEid = hexToNumber(sliceHex(hex, internalOffset, _EVMBase.TARGET_EID_BYTES));
    internalOffset += bytesToHexLength(_EVMBase.TARGET_EID_BYTES);
    const timestampBlockFlag = hexToNumber(
      sliceHex(hex, internalOffset, _EVMBase.TIMESTAMP_BLOCK_FLAG_BYTES)
    );
    internalOffset += bytesToHexLength(_EVMBase.TIMESTAMP_BLOCK_FLAG_BYTES);
    let timestamp;
    let blockNumber;
    if (timestampBlockFlag === 0 /* Timestamp */) {
      timestamp = hexToBigInt(sliceHex(hex, internalOffset, _EVMBase.TIMESTAMP_BYTES));
      internalOffset += bytesToHexLength(_EVMBase.TIMESTAMP_BYTES);
    } else {
      blockNumber = hexToBigInt(sliceHex(hex, internalOffset, _EVMBase.BLOCK_NUMBER_BYTES));
      internalOffset += bytesToHexLength(_EVMBase.BLOCK_NUMBER_BYTES);
    }
    const blockConfirmations = hexToNumber(sliceHex(hex, internalOffset, _EVMBase.BLOCK_CONFIRMATIONS_BYTES));
    internalOffset += bytesToHexLength(_EVMBase.BLOCK_CONFIRMATIONS_BYTES);
    const to = sliceHex(hex, internalOffset, _EVMBase.TO_BYTES);
    return new _EVMBase(targetEid, timestampBlockFlag, blockConfirmations, to, timestamp, blockNumber);
  }
};
var SingleViewFunctionEVMCall = class _SingleViewFunctionEVMCall extends EVMBase {
  requestHeader;
  calldata;
  // Calldata (size specified by calldataSize)
  /**
   * Creates an instance of the SingleViewFunctionEVMCall class.
   *
   * @param {RequestHeader} requestHeader - The request header.
   * @param {number} targetEid - The target endpoint ID.
   * @param {TimestampBlockConfiguration} timestampBlockFlag - The timestamp block configuration.
   * @param {number} blockConfirmations - The number of block confirmations.
   * @param {string} to - The recipient address.
   * @param {string} calldata - The calldata.
   * @param {bigint} [timestamp] - The timestamp.
   * @param {bigint} [blockNumber] - The block number.
   */
  constructor(requestHeader, targetEid, timestampBlockFlag, blockConfirmations, to, calldata, timestamp, blockNumber) {
    super(targetEid, timestampBlockFlag, blockConfirmations, to, timestamp, blockNumber);
    this.requestHeader = requestHeader;
    this.calldata = calldata;
    const evmByteLength = super.getByteLength();
    const callDataSize = this.requestHeader.requestSize - evmByteLength;
    this.byteLength = this.requestHeader.getByteLength() + evmByteLength + callDataSize;
  }
  /**
   * Encodes the single view function EVM call to a hex string.
   *
   * @returns {string} The encoded hex string.
   */
  encode() {
    const requestHeaderHex = this.requestHeader.encode();
    const evmBaseHex = super.encode();
    const callDataSize = this.requestHeader.requestSize - super.getByteLength();
    const calldataHex = this.calldata.padStart(callDataSize * 2, "0");
    return requestHeaderHex + evmBaseHex + calldataHex;
  }
  /**
   * Decodes a hex string to a single view function EVM call.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} [offset] - The offset to start decoding from.
   * @returns {SingleViewFunctionEVMCall} The decoded single view function EVM call.
   */
  static decode(hex, offset) {
    let internalOffset = offset ?? 0;
    const requestHeader = RequestHeader.decode(hex, internalOffset);
    internalOffset += requestHeader.getHexLength();
    const evmBase = super.decode(hex, internalOffset);
    internalOffset += evmBase.getHexLength();
    const calldataSize = requestHeader.requestSize - evmBase.getByteLength();
    const calldata = sliceHex(hex, internalOffset, calldataSize);
    return new _SingleViewFunctionEVMCall(
      requestHeader,
      evmBase.targetEid,
      evmBase.timestampBlockFlag,
      evmBase.blockConfirmations,
      evmBase.to,
      calldata,
      evmBase.timestamp,
      evmBase.blockNumber
    );
  }
};
var ComputeHeader = class _ComputeHeader extends Codec {
  computeVersion;
  // 1 byte
  computeType;
  // 2 bytes
  computeSetting;
  // 1 byte
  static COMPUTE_VERSION_BYTES = 1;
  static COMPUTE_TYPE_BYTES = 2;
  static COMPUTE_SETTING_BYTES = 1;
  /**
   * Creates an instance of the ComputeHeader class.
   *
   * @param {number} computeVersion - The compute version.
   * @param {ComputeType} computeType - The compute type.
   * @param {ComputeSetting} computeSetting - The compute setting.
   */
  constructor(computeVersion, computeType, computeSetting) {
    super();
    this.computeVersion = computeVersion;
    this.computeType = computeType;
    this.computeSetting = computeSetting;
    this.byteLength = _ComputeHeader.COMPUTE_VERSION_BYTES + _ComputeHeader.COMPUTE_TYPE_BYTES + _ComputeHeader.COMPUTE_SETTING_BYTES;
  }
  /**
   * Encodes the compute header to a hex string.
   *
   * @returns {string} The encoded hex string.
   */
  encode() {
    const computeVersionHex = numberToHex(this.computeVersion, _ComputeHeader.COMPUTE_VERSION_BYTES);
    const computeTypeHex = numberToHex(this.computeType, _ComputeHeader.COMPUTE_TYPE_BYTES);
    const computeSettingHex = numberToHex(this.computeSetting, _ComputeHeader.COMPUTE_SETTING_BYTES);
    return computeVersionHex + computeTypeHex + computeSettingHex;
  }
  /**
   * Decodes a hex string to a compute header.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} [offset] - The offset to start decoding from.
   * @returns {ComputeHeader} The decoded compute header.
   */
  static decode(hex, offset) {
    let internalOffset = offset ?? 0;
    const computeVersion = hexToNumber(sliceHex(hex, internalOffset, _ComputeHeader.COMPUTE_VERSION_BYTES));
    internalOffset += bytesToHexLength(_ComputeHeader.COMPUTE_VERSION_BYTES);
    const computeType = hexToNumber(sliceHex(hex, internalOffset, _ComputeHeader.COMPUTE_TYPE_BYTES));
    internalOffset += bytesToHexLength(_ComputeHeader.COMPUTE_TYPE_BYTES);
    const computeSetting = hexToNumber(sliceHex(hex, internalOffset, _ComputeHeader.COMPUTE_SETTING_BYTES));
    return new _ComputeHeader(computeVersion, computeType, computeSetting);
  }
};
var ComputeEVM = class _ComputeEVM extends EVMBase {
  computeHeader;
  /**
   * Creates an instance of the ComputeEVM class.
   *
   * @param {ComputeHeader} computeHeader - The compute header.
   * @param {number} targetEid - The target endpoint ID.
   * @param {TimestampBlockConfiguration} timestampBlockFlag - The timestamp block configuration.
   * @param {number} blockConfirmations - The number of block confirmations.
   * @param {string} to - The recipient address.
   * @param {bigint} [timestamp] - The timestamp.
   * @param {bigint} [blockNumber] - The block number.
   */
  constructor(computeHeader, targetEid, timestampBlockFlag, blockConfirmations, to, timestamp, blockNumber) {
    super(targetEid, timestampBlockFlag, blockConfirmations, to, timestamp, blockNumber);
    this.computeHeader = computeHeader;
    const evmByteLength = super.getByteLength();
    this.byteLength += evmByteLength + this.computeHeader.getByteLength();
  }
  /**
   * Encodes the compute EVM to a hex string.
   *
   * @returns {string} The encoded hex string.
   */
  encode() {
    const computeHeaderHex = this.computeHeader.encode();
    const evmBaseHex = super.encode();
    return computeHeaderHex + evmBaseHex;
  }
  /**
   * Decodes a hex string to a compute EVM.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} [offset] - The offset to start decoding from.
   * @returns {ComputeEVM} The decoded compute EVM.
   */
  static decode(hex, offset) {
    let internalOffset = offset ?? 0;
    const computeHeader = ComputeHeader.decode(hex, internalOffset);
    internalOffset += computeHeader.getHexLength();
    const evmBase = EVMBase.decode(hex, internalOffset);
    internalOffset += evmBase.getHexLength();
    return new _ComputeEVM(
      computeHeader,
      evmBase.targetEid,
      evmBase.timestampBlockFlag,
      evmBase.blockConfirmations,
      evmBase.to,
      evmBase.timestamp,
      evmBase.blockNumber
    );
  }
};
var Command = class _Command extends Codec {
  header;
  requests;
  compute;
  /**
   * Creates an instance of the Command class.
   *
   * @param {Header} header - The command header.
   * @param {CommandRequest[]} requests - The command requests.
   * @param {Compute} [compute] - The compute object.
   */
  constructor(header, requests, compute) {
    super();
    this.header = header;
    this.requests = requests;
    this.compute = compute;
    this.byteLength = this.header.getByteLength() + this.requests.reduce((acc, req) => acc + req.getByteLength(), 0) + (this.compute ? this.compute.getByteLength() : 0);
  }
  /**
   * Encodes a command request.
   *
   * @param {CommandRequest} request - The command request to encode.
   * @returns {string} The encoded command request.
   * @throws {Error} If the resolver type is invalid.
   */
  encodeCommandRequest(request) {
    switch (request.requestHeader.resolverType) {
      case 1 /* SingleViewFunctionEVMCall */:
        return request.encode();
      default:
        throw new Error("Invalid resolver type");
    }
  }
  /**
   * Encodes the compute object.
   *
   * @returns {string} The encoded compute object.
   * @throws {Error} If the compute type is invalid.
   */
  encodeCompute() {
    if (!this.compute) {
      return "";
    }
    switch (this.compute.computeHeader.computeType) {
      case 1 /* SingleViewFunctionEVMCall */:
        return this.compute.encode();
      default:
        throw new Error("Invalid compute type");
    }
  }
  /**
   * Encodes the command.
   *
   * @returns {string} The encoded command.
   */
  encode() {
    const headerHex = this.header.encode();
    const requestsHex = this.requests.map((req) => this.encodeCommandRequest(req)).join("");
    const computeHex = this.encodeCompute();
    return headerHex + requestsHex + computeHex;
  }
  /**
   * Decodes a command request.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} offset - The offset to start decoding from.
   * @returns {CommandRequest} The decoded command request.
   * @throws {Error} If the resolver type is invalid.
   */
  static decodeRequest(hex, offset) {
    const requestHeader = RequestHeader.decode(hex, offset);
    switch (requestHeader.resolverType) {
      case 1 /* SingleViewFunctionEVMCall */:
        return SingleViewFunctionEVMCall.decode(hex, offset);
      default:
        throw new Error("Invalid resolver type");
    }
  }
  /**
   * Decodes the compute object.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} offset - The offset to start decoding from.
   * @returns {Compute} The decoded compute object.
   * @throws {Error} If the compute type is invalid.
   */
  static decodeCompute(hex, offset) {
    const computeHeader = ComputeHeader.decode(hex, offset);
    switch (computeHeader.computeType) {
      case 1 /* SingleViewFunctionEVMCall */:
        return ComputeEVM.decode(hex, offset);
      default:
        throw new Error("Invalid compute type");
    }
  }
  /**
   * Decodes a command.
   *
   * @param {string} hex - The hex string to decode.
   * @param {number} [offset=0] - The offset to start decoding from.
   * @returns {Command} The decoded command.
   */
  static decode(hex, offset) {
    let internalOffset = offset ?? 0;
    const header = Header.decode(hex, internalOffset);
    internalOffset += header.getHexLength();
    const requests = [];
    for (let i = 0; i < header.requestCount; i++) {
      const request = _Command.decodeRequest(hex, internalOffset);
      requests.push(request);
      internalOffset += request.getHexLength();
    }
    const command = internalOffset === hex.length ? new _Command(header, requests) : new _Command(header, requests, _Command.decodeCompute(hex, internalOffset));
    return command;
  }
};
function bytesToHexLength(bytes) {
  return bytes * 2;
}
function sliceHex(hex, offset, bytes) {
  const length = bytesToHexLength(bytes);
  const slice = hex.slice(offset, offset + length);
  return slice;
}
function hexToNumber(hexStr) {
  return parseInt(hexStr, 16);
}
function hexToBigInt(hexStr) {
  return BigInt(`0x${hexStr}`);
}
function numberToHex(num, bytes) {
  return num.toString(16).padStart(bytes * 2, "0");
}
function bigIntToHex(bigInt, bytes) {
  return bigInt.toString(16).padStart(bytes * 2, "0");
}

export { Command, ComputeEVM, ComputeHeader, ComputeSetting, ComputeType, EVMBase, ExecutorOptionType, Header, OptionType, Options, PacketSerializer, PacketV1Codec, RequestHeader, ResolverType, SingleViewFunctionEVMCall, TimestampBlockConfiguration, VerifierOptionType, WorkerId, addressToBytes32, bytes32ToEthAddress, calculateGuid, hexZeroPadTo32, isAptosAddress, isInitiaAddress, isSolanaAddress, isTonAddress, optionsType1, optionsType2, packetToMessageOrigin, parseError, parsePrecrimeConfig, trim0x };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map