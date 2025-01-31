import { Interface } from '@ethersproject/abi';
export { keccak256 } from '@ethersproject/keccak256';

/**
 * Pads a hexadecimal address to 32 bytes.
 *
 * @param addr - The address to pad.
 *
 * @returns {string} The padded address.
 */
declare function hexZeroPadTo32(addr: string): string;
/**
 * Converts a bytes32 value to an Ethereum address.
 *
 * @param bytes32 - The bytes32 value.
 *
 * @returns {string} The Ethereum address.
 */
declare function bytes32ToEthAddress(bytes32: string | Uint8Array): string;
/**
 * Trims the '0x' prefix from a hexadecimal string.
 *
 * @param str - The hexadecimal string.
 *
 * @returns {string} The trimmed string.
 */
declare function trim0x(str: string): string;
/**
 * Converts an address to bytes32.
 *
 * @param address - The address to convert.
 *
 * @returns {Uint8Array} The bytes32 representation of the address.
 *
 * @throws {Error} If the address is invalid.
 */
declare function addressToBytes32(address: string): Uint8Array;
/**
 * Checks if an address is a Solana address.
 *
 * @param address - The address to check.
 *
 * @returns {boolean} True if the address is a Solana address, false otherwise.
 */
declare function isSolanaAddress(address: string): boolean;
/**
 * Checks if an address is an Aptos address.
 *
 * @param address - The address to check.
 *
 * @returns {boolean} True if the address is an Aptos address, false otherwise. Could be short address.
 */
declare function isAptosAddress(address: string): boolean;
/**
 * Checks if an address is an Initia address. Could be short address.
 *
 * @param address - The address to check.
 *
 * @returns {boolean} True if the address is an Initia address, false otherwise.
 */
declare function isInitiaAddress(address: string): boolean;
/**
 * Check if the address is a valid TON address
 *
 * A valid TON address should be a 64-character hexadecimal string
 *
 * Reference implementation:
 * https://github.com/ton-org/ton-core/blob/9c1b8f7e38c5aaef518cffb058c78a6768026e6d/src/address/Address.ts#L94
 *
 * @param address The address string to check
 * @returns true if it's a valid TON address, false otherwise
 */
declare function isTonAddress(address: string): boolean;

/**
 * Path information for a packet.
 */
interface PacketPath {
    /**
     * Source EID.
     */
    srcEid: number;
    /**
     * Sender address.
     */
    sender: string;
    /**
     * Destination EID.
     */
    dstEid: number;
    /**
     * Receiver address.
     */
    receiver: string;
}
/**
 * Header information for a packet.
 *
 * @extends PacketPath
 */
type PacketHeader = {
    /**
     * Version number.
     */
    version: number;
    /**
     * Nonce value.
     */
    nonce: string;
} & PacketPath;
/**
 * Packet structure.
 *
 * @extends PacketHeader
 */
type Packet = PacketHeader & {
    /**
     * GUID of the packet.
     */
    guid: string;
    /**
     * Message content.
     */
    message: string;
    /**
     * Derived payload.
     *
     * payload = guid + message
     */
    payload: string;
};
/**
 * Origin information for a message.
 */
interface MessageOrigin {
    /**
     * Source EID.
     */
    srcEid: number;
    /**
     * Sender address.
     */
    sender: string;
    /**
     * Nonce value.
     */
    nonce: string;
}
/**
 * Converts a packet to a message origin.
 *
 * @param {Packet} packet - The packet to convert.
 *
 * @returns {MessageOrigin} The message origin.
 */
declare function packetToMessageOrigin(packet: Packet): MessageOrigin;

/**
 * Configuration for Precrime version 1.
 */
interface PrecrimeConfigV1 {
    /**
     * Version number.
     */
    version: number;
    /**
     * Maximum batch size.
     */
    maxBatchSize: number;
    /**
     * List of remote EIDs.
     */
    remoteEids: number[];
    /**
     * List of remote addresses.
     */
    remoteAddresses: string[];
}
/**
 * Configuration for Precrime version 2.
 */
interface PrecrimeConfigV2 {
    /**
     * Version number.
     */
    version: number;
    /**
     * Maximum batch size.
     */
    maxBatchSize: bigint;
    /**
     * List of peers.
     */
    peers: PreCrimePeer[];
}
/**
 * Union type for Precrime configuration.
 */
type PrecrimeConfig = PrecrimeConfigV1 | PrecrimeConfigV2;
/**
 * Packet for Precrime.
 */
interface PrecrimePacket {
    /**
     * Origin of the message.
     */
    origin: MessageOrigin;
    /**
     * GUID of the packet.
     */
    guid: string;
    /**
     * Message content.
     */
    message: string;
    /**
     * Call parameters.
     */
    callParams: string;
}
/**
 * Peer information for Precrime.
 */
interface PreCrimePeer {
    /**
     * EID of the peer.
     */
    eid: number;
    /**
     * Precrime address of the peer.
     */
    preCrimeAddress: string;
    /**
     * OAPP address of the peer.
     */
    oappAddress: string;
}

/**
 * Parses the precrime configuration string.
 *
 * @param precrimeConfig - The precrime configuration string.
 *
 * @returns {PrecrimeConfig} The parsed precrime configuration.
 *
 * @throws {Error} If the precrime config version is unsupported.
 */
declare function parsePrecrimeConfig(precrimeConfig: string): PrecrimeConfig;

/**
 * Parses the error data.
 *
 * @param errorData - The error data string.
 * @param intf - The optional interface to parse the error.
 *
 * @returns {ReturnType<Interface['parseError']> | string | number | undefined} The parsed error.
 */
declare const parseError: (errorData: string, intf?: Interface) => ReturnType<Interface['parseError']> | string | number | undefined;

type GasLimit = string | number | bigint;
type NativeDrop = string | number | bigint;
type DataSize = string | number | bigint;
/**
 * Enumerates the supported option types.
 */
declare enum OptionType {
    /**
     * Allows the specification of the gas allowance for the remote executor transaction, measured in destination gas
     * units.
     *
     * Format:
     * bytes  [2     32      ]
     * fields [type  extraGas]
     */
    TYPE_1 = 1,
    /**
     * Combines the functionality of TYPE_1 along with destination gas drop to a remote address.
     *
     * Format:
     * bytes  [2     32        32            bytes[]         ]
     * fields [type  extraGas  dstNativeAmt  dstNativeAddress]
     */
    TYPE_2 = 2,
    /**
     * EndpointV2 specific options.
     */
    TYPE_3 = 3
}
/**
 * Builds OptionsType.TYPE_1.
 *
 * @param {GasLimit} _extraGas The gas allowance for the remote executor transaction, measured in destination gas units.
 */
declare function optionsType1(_extraGas: GasLimit): string;
/**
 * Builds OptionsType.TYPE_2.
 *
 * @param {GasLimit} _extraGas The gas allowance for the remote executor transaction, measured in destination gas units.
 * @param {NativeDrop} _dstNativeAmt The amount of native token to be sent to the destination chain.
 * @param {string} _dstNativeAddress The destination address of _dstNativeAmt.
 */
declare function optionsType2(_extraGas: GasLimit, _dstNativeAmt: NativeDrop, _dstNativeAddress: string): string;
/**
 * Enumerates the supported worker IDs.
 */
declare enum WorkerId {
    /**
     * Executor worker ID.
     */
    EXECUTOR = 1,
    /**
     * Verifier worker ID.
     */
    VERIFIER = 2,
    /**
     * Treasury worker ID.
     */
    TREASURY = 255
}
/**
 * Interface representing worker options.
 */
interface WorkerOptions {
    /**
     * The worker ID.
     */
    workerId: number;
    /**
     * The options.
     */
    options: Option[];
}
/**
 * Interface representing an option.
 */
interface Option {
    /**
     * The option type.
     */
    type: number;
    /**
     * The option parameters.
     */
    params: string;
}
/**
 * Interface representing a verifier option.
 */
type VerifierOption = Option & {
    /**
     * The verifier index.
     */
    index: number;
};
/**
 * Enumerates the supported executor option types.
 */
declare enum ExecutorOptionType {
    /**
     * LZ_RECEIVE option type.
     */
    LZ_RECEIVE = 1,
    /**
     * NATIVE_DROP option type.
     */
    NATIVE_DROP = 2,
    /**
     * COMPOSE option type.
     */
    COMPOSE = 3,
    /**
     * ORDERED option type.
     */
    ORDERED = 4,
    /**
     * LZ_READ option type.
     */
    LZ_READ = 5
}
/**
 * Enumerates the supported verifier option types.
 */
declare enum VerifierOptionType {
    /**
     * PRECRIME option type.
     */
    PRECRIME = 1
}
/**
 * ExecutorLzReceiveOption type.
 */
interface ExecutorLzReceiveOption {
    /**
     * The gas limit.
     */
    gas: bigint;
    /**
     * The value.
     */
    value: bigint;
}
/**
 * ExecutorLzReadOption type.
 */
interface ExecutorLzReadOption {
    /**
     * The gas limit.
     */
    gas: bigint;
    /**
     * The data size.
     */
    dataSize: bigint;
    /**
     * The value.
     */
    value: bigint;
}
/**
 * ExecutorNativeDropOption type.
 */
type ExecutorNativeDropOption = {
    amount: bigint;
    receiver: string;
}[];
/**
 * ComposeOption type.
 */
type ComposeOption = {
    index: number;
    gas: bigint;
    value: bigint;
}[];
/**
 * Options builder, available only for EndpointV2.
 */
declare class Options {
    protected workerOptions: WorkerOptions[];
    protected constructor();
    /**
     * Create a new options instance.
     */
    static newOptions(): Options;
    /**
     * Create an options instance from a hex string.
     * @param {string} optionsHex The hex string to decode.
     */
    static fromOptions(optionsHex: string): Options;
    /**
     * Add ExecutorOptionType.LZ_RECEIVE option.
     * @param {GasLimit} gasLimit
     * @param {NativeDrop} nativeDrop
     */
    addExecutorLzReceiveOption(gasLimit: GasLimit, nativeDrop?: NativeDrop): this;
    /**
     * Add ExecutorOptionType.NATIVE_DROP option.
     * @param {NativeDrop} nativeDrop
     * @param {string} receiver
     */
    addExecutorNativeDropOption(nativeDrop: NativeDrop, receiver: string): this;
    /**
     * Add ExecutorOptionType.COMPOSE option.
     * @param {number} index
     * @param {GasLimit} gasLimit
     * @param {NativeDrop} nativeDrop
     */
    addExecutorComposeOption(index: number, gasLimit: GasLimit, nativeDrop?: NativeDrop): this;
    /**
     * Add ExecutorOptionType.ORDERED option.
     *
     * @returns {this} The options instance.
     */
    addExecutorOrderedExecutionOption(): this;
    /**
     * Add ExecutorOptionType.LZ_READ option.
     *
     * @param {GasLimit} gasLimit - The gas limit.
     * @param {DataSize} dataSize - The data size.
     * @param {NativeDrop} [nativeDrop=0] - The native drop.
     * @returns {this} The options instance.
     */
    addExecutorLzReadOption(gasLimit: GasLimit, dataSize: DataSize, nativeDrop?: NativeDrop): this;
    /**
     * Add VerifierOptionType.PRECRIME option.
     *
     * @param {number} verifierIdx - The verifier index.
     * @returns {this} The options instance.
     */
    addVerifierPrecrimeOption(verifierIdx: number): this;
    /**
     * Serialize Options to hex string.
     *
     * @returns {string} The serialized hex string.
     */
    toHex(): string;
    /**
     * Serialize Options to Uint8Array.
     *
     * @returns {Uint8Array} The serialized Uint8Array.
     */
    toBytes(): Uint8Array;
    /**
     * Adds an option to the specified worker.
     *
     * @param {number} workerId - The ID of the worker.
     * @param {Option} option - The option to add.
     */
    private addOption;
    /**
     * Decode ExecutorOptionType.LZ_RECEIVE option. Returns undefined if the option is not present.
     *
     * @returns {ExecutorLzReceiveOption | undefined} The decoded option or undefined if not present.
     */
    decodeExecutorLzReceiveOption(): ExecutorLzReceiveOption | undefined;
    /**
     * Decode ExecutorOptionType.NATIVE_DROP options. Returns undefined if the options is not present.
     *
     * @returns {ExecutorNativeDropOption} The decoded options.
     */
    decodeExecutorNativeDropOption(): ExecutorNativeDropOption;
    /**
     * Decode ExecutorOptionType.COMPOSE options. Returns undefined if the options is not present.
     *
     * @returns {ComposeOption} The decoded options.
     */
    decodeExecutorComposeOption(): ComposeOption;
    /**
     * Decode ExecutorOptionType.ORDERED options. Returns undefined if the options is not present.
     *
     * @returns {boolean} True if the option is present, false otherwise.
     */
    decodeExecutorOrderedExecutionOption(): boolean;
    /**
     * Decodes ExecutorOptionType.LZ_READ options. Returns undefined if the option is not present.
     *
     * @returns {ExecutorLzReadOption | undefined} The decoded ExecutorLzReadOption or undefined if not present.
     */
    decodeExecutorLzReadOption(): ExecutorLzReadOption | undefined;
    /**
     * Finds options for a given worker and option type.
     *
     * @param {number} workerId - The ID of the worker.
     * @param {number} optionType - The type of the option.
     * @returns {Option[] | Option | undefined} The found options or undefined if not present.
     */
    private findOptions;
    /**
     * Finds a VerifierOption by verifier index and option type. Returns undefined if the option is not present.
     *
     * @param {number} verifierIdx - The index of the verifier.
     * @param {number} optionType - The type of the option.
     * @returns {VerifierOption | undefined} The found VerifierOption or undefined if not present.
     */
    findVerifierOption(verifierIdx: number, optionType: number): VerifierOption | undefined;
}

/**
 * Class representing the PacketV1Codec.
 */
declare class PacketV1Codec {
    /**
     * Buffer to hold the encoded packet data.
     */
    buffer: Buffer;
    /**
     * Create a PacketV1Codec instance from an encoded payload string.
     *
     * @param {string | Uint8Array | Packet} payload - The encoded payload string.
     * @returns A new PacketV1Codec instance.
     */
    static from(payload: string | Uint8Array | Packet): PacketV1Codec;
    /**
     * Create a PacketV1Codec instance from a byte array.
     *
     * @param payload - The byte array representing the payload.
     * @returns A new PacketV1Codec instance.
     */
    static fromBytes(payload: Uint8Array): PacketV1Codec;
    /**
     * Constructor for the PacketV1Codec class.
     *
     * @param payloadEncoded - The encoded payload string.
     */
    protected constructor(payloadEncoded: string);
    /**
     * Encode a packet to a hex string.
     *
     * @param packet - The packet to encode.
     * @returns The encoded packet as a hex string.
     */
    static encode(packet: Packet): string;
    /**
     * Encode a packet to a Uint8Array.
     *
     * @param packet - The packet to encode.
     * @returns The encoded packet as a Uint8Array.
     */
    static encodeBytes(packet: Packet): Uint8Array;
    /**
     * Get the version of the packet.
     *
     * @returns The version of the packet.
     */
    version(): number;
    /**
     * Get the nonce of the packet.
     *
     * @returns The nonce of the packet as a string.
     */
    nonce(): string;
    /**
     * Get the source chain ID of the packet.
     *
     * @returns The source chain ID of the packet.
     */
    srcEid(): number;
    /**
     * Get the sender address of the packet.
     *
     * @returns The sender address of the packet.
     */
    sender(): string;
    /**
     * Get the sender address in B20 format.
     *
     * @returns The sender address in B20 format.
     */
    senderAddressB20(): string;
    /**
     * Get the destination chain ID of the packet.
     *
     * @returns The destination chain ID of the packet.
     */
    dstEid(): number;
    /**
     * Get the receiver address of the packet.
     *
     * @returns The receiver address of the packet.
     */
    receiver(): string;
    /**
     * Get the receiver address in B20 format.
     *
     * @returns The receiver address in B20 format.
     */
    receiverAddressB20(): string;
    /**
     * Get the GUID of the packet.
     *
     * @returns The GUID of the packet.
     */
    guid(): string;
    /**
     * Get the message of the packet.
     *
     * @returns The message of the packet.
     */
    message(): string;
    /**
     * Get the hash of the payload.
     *
     * @returns The hash of the payload.
     */
    payloadHash(): string;
    /**
     * Get the payload of the packet.
     *
     * @returns The payload of the packet.
     */
    payload(): string;
    /**
     * Get the header of the packet.
     *
     * @returns The header of the packet.
     */
    header(): string;
    /**
     * Get the hash of the header.
     *
     * @returns The hash of the header.
     */
    headerHash(): string;
    /**
     * Deserialize packet from hex string.
     *
     * @deprecated Use toPacket instead.
     * @returns The deserialized packet.
     */
    decode(): Packet;
    /**
     * Convert the encoded data to a Packet object.
     *
     * @returns The Packet object.
     */
    toPacket(): Packet;
}
/**
 * Calculate the GUID for a packet header.
 *
 * @param packetHead - The packet header.
 * @returns The calculated GUID.
 */
declare function calculateGuid(packetHead: PacketHeader): string;

/**
 * Serializer for Packet objects.
 */
declare class PacketSerializer {
    /**
     * Serializes a Packet object to a string.
     *
     * @param {Packet} packet - The packet to serialize.
     * @returns {string} The serialized packet as a string.
     */
    static serialize(packet: Packet): string;
    /**
     * Serializes a Packet object to a Uint8Array.
     *
     * @param {Packet} packet - The packet to serialize.
     * @returns {Uint8Array} The serialized packet as a Uint8Array.
     */
    static serializeBytes(packet: Packet): Uint8Array;
    /**
     * Deserializes a Uint8Array or string to a Packet object.
     *
     * @param {Uint8Array | string} bytesLike - The bytes or string to deserialize.
     * @returns {Packet} The deserialized Packet object.
     */
    static deserialize(bytesLike: Uint8Array | string): Packet;
}

/**
 * Abstract class representing a codec.
 */
declare abstract class Codec {
    protected byteLength: number;
    /**
     * Creates an instance of the Codec class.
     */
    constructor();
    /**
     * Gets the byte length of the codec.
     *
     * @returns {number} The byte length.
     */
    getByteLength(): number;
    /**
     * Gets the hex length of the codec.
     *
     * @returns {number} The hex length.
     */
    getHexLength(): number;
    /**
     * Encodes the codec to a hex string.
     *
     * @returns {string} The encoded hex string.
     */
    abstract encode(): string;
    /**
     * Decodes a hex string to a codec.
     *
     * @param {string} hex - The hex string to decode.
     * @returns {Codec} The decoded codec.
     * @throws {Error} If the method is not implemented.
     */
    static decode(hex: string): Codec;
}
/**
 * Enum representing the timestamp block configuration.
 */
declare enum TimestampBlockConfiguration {
    /**
     * Represents a timestamp.
     */
    Timestamp = 0,
    /**
     * Represents a block number.
     */
    BlockNumber = 1
}
/**
 * Enum representing the resolver type.
 */
declare enum ResolverType {
    /**
     * Represents a single view function EVM call.
     */
    SingleViewFunctionEVMCall = 1
}
/**
 * Enum representing the compute setting.
 */
declare enum ComputeSetting {
    /**
     * Only map.
     */
    OnlyMap = 0,
    /**
     * Only reduce.
     */
    OnlyReduce = 1,
    /**
     * Map and reduce.
     */
    MapReduce = 2
}
/**
 * Enum representing the compute type.
 */
declare enum ComputeType {
    /**
     * Represents a single view function EVM call.
     */
    SingleViewFunctionEVMCall = 1
}
/**
 * Interface representing an EVM timestamp.
 */
interface EVMTimestamp {
    /**
     * The timestamp.
     */
    timestamp: bigint;
}
/**
 * Interface representing an EVM block.
 */
interface EVMBlock {
    /**
     * The block number.
     */
    blockNumber: bigint;
}
/**
 * Interface representing a command request.
 * @see {@link Codec}
 */
interface CommandRequest extends Codec {
    /**
     * The request header.
     */
    requestHeader: RequestHeader;
}
/**
 * Interface representing a compute.
 * @see {@link Codec}
 */
interface Compute extends Codec {
    /**
     * The compute header.
     */
    computeHeader: ComputeHeader;
}
/**
 * Class representing a header.
 * @see {@link Codec}
 */
declare class Header extends Codec {
    globalVersion: number;
    appCommandLabel: string;
    requestCount: number;
    private static GLOBAL_VERSION_BYTES;
    private static APP_COMMAND_LABEL_BYTES;
    private static REQUEST_COUNT_BYTES;
    /**
     * Creates an instance of the Header class.
     *
     * @param {number} globalVersion - The global version.
     * @param {string} appCommandLabel - The application command label.
     * @param {number} requestCount - The number of requests.
     */
    constructor(globalVersion: number, appCommandLabel: string, requestCount: number);
    /**
     * Encodes the header to a hex string.
     *
     * @returns {string} The encoded hex string.
     */
    encode(): string;
    /**
     * Decodes a hex string to a header.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} [offset] - The offset to start decoding from.
     * @returns {Header} The decoded header.
     */
    static decode(hex: string, offset?: number): Header;
}
/**
 * Class representing a request header.
 * @see {@link Codec}
 */
declare class RequestHeader extends Codec {
    requestVersion: number;
    appRequestLabel: string;
    resolverType: ResolverType;
    requestSize: number;
    private static REQUEST_VERSION_BYTES;
    private static APP_REQUEST_LABEL_BYTES;
    private static RESOLVER_TYPE_BYTES;
    private static REQUEST_SIZE_BYTES;
    /**
     * Creates an instance of the RequestHeader class.
     *
     * @param {number} requestVersion - The request version.
     * @param {string} appRequestLabel - The application request label.
     * @param {ResolverType} resolverType - The resolver type.
     * @param {number} requestSize - The request size.
     */
    constructor(requestVersion: number, appRequestLabel: string, resolverType: ResolverType, requestSize: number);
    /**
     * Encodes the request header to a hex string.
     *
     * @returns {string} The encoded hex string.
     */
    encode(): string;
    /**
     * Decodes a hex string to a request header.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} [offset] - The offset to start decoding from.
     * @returns {RequestHeader} The decoded request header.
     */
    static decode(hex: string, offset?: number): RequestHeader;
}
/**
 * Class representing an EVM base.
 * @see {@link Codec}
 */
declare class EVMBase extends Codec {
    targetEid: number;
    timestampBlockFlag: TimestampBlockConfiguration;
    blockConfirmations: number;
    to: string;
    timestamp?: bigint;
    blockNumber?: bigint;
    private static TARGET_EID_BYTES;
    private static TIMESTAMP_BLOCK_FLAG_BYTES;
    private static BLOCK_CONFIRMATIONS_BYTES;
    private static TO_BYTES;
    private static TIMESTAMP_BYTES;
    private static BLOCK_NUMBER_BYTES;
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
    protected constructor(targetEid: number, timestampBlockFlag: TimestampBlockConfiguration, blockConfirmations: number, to: string, timestamp?: bigint, blockNumber?: bigint);
    /**
     * Encodes the EVM base to a hex string.
     *
     * @returns {string} The encoded hex string.
     */
    encode(): string;
    /**
     * Decodes a hex string to an EVM base.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} [offset] - The offset to start decoding from.
     * @returns {EVMBase} The decoded EVM base.
     */
    static decode(hex: string, offset?: number): EVMBase;
}
/**
 * Class representing a single view function EVM call.
 * @see {@link EVMBase}, {@link CommandRequest}
 */
declare class SingleViewFunctionEVMCall extends EVMBase implements CommandRequest {
    requestHeader: RequestHeader;
    calldata: string;
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
    constructor(requestHeader: RequestHeader, targetEid: number, timestampBlockFlag: TimestampBlockConfiguration, blockConfirmations: number, to: string, calldata: string, timestamp?: bigint, blockNumber?: bigint);
    /**
     * Encodes the single view function EVM call to a hex string.
     *
     * @returns {string} The encoded hex string.
     */
    encode(): string;
    /**
     * Decodes a hex string to a single view function EVM call.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} [offset] - The offset to start decoding from.
     * @returns {SingleViewFunctionEVMCall} The decoded single view function EVM call.
     */
    static decode(hex: string, offset?: number): SingleViewFunctionEVMCall;
}
/**
 * Class representing a compute header.
 * @see {@link Codec}
 */
declare class ComputeHeader extends Codec {
    computeVersion: number;
    computeType: ComputeType;
    computeSetting: ComputeSetting;
    private static COMPUTE_VERSION_BYTES;
    private static COMPUTE_TYPE_BYTES;
    private static COMPUTE_SETTING_BYTES;
    /**
     * Creates an instance of the ComputeHeader class.
     *
     * @param {number} computeVersion - The compute version.
     * @param {ComputeType} computeType - The compute type.
     * @param {ComputeSetting} computeSetting - The compute setting.
     */
    constructor(computeVersion: number, computeType: ComputeType, computeSetting: ComputeSetting);
    /**
     * Encodes the compute header to a hex string.
     *
     * @returns {string} The encoded hex string.
     */
    encode(): string;
    /**
     * Decodes a hex string to a compute header.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} [offset] - The offset to start decoding from.
     * @returns {ComputeHeader} The decoded compute header.
     */
    static decode(hex: string, offset?: number): ComputeHeader;
}
/**
 * Class representing a compute EVM.
 * @see {@link EVMBase}, {@link Compute}
 */
declare class ComputeEVM extends EVMBase implements Compute {
    computeHeader: ComputeHeader;
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
    constructor(computeHeader: ComputeHeader, targetEid: number, timestampBlockFlag: TimestampBlockConfiguration, blockConfirmations: number, to: string, timestamp?: bigint, blockNumber?: bigint);
    /**
     * Encodes the compute EVM to a hex string.
     *
     * @returns {string} The encoded hex string.
     */
    encode(): string;
    /**
     * Decodes a hex string to a compute EVM.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} [offset] - The offset to start decoding from.
     * @returns {ComputeEVM} The decoded compute EVM.
     */
    static decode(hex: string, offset?: number): ComputeEVM;
}
/**
 * Class representing a command.
 * @see {@link Codec}
 */
declare class Command extends Codec {
    header: Header;
    requests: CommandRequest[];
    compute?: Compute;
    /**
     * Creates an instance of the Command class.
     *
     * @param {Header} header - The command header.
     * @param {CommandRequest[]} requests - The command requests.
     * @param {Compute} [compute] - The compute object.
     */
    constructor(header: Header, requests: CommandRequest[], compute?: Compute);
    /**
     * Encodes a command request.
     *
     * @param {CommandRequest} request - The command request to encode.
     * @returns {string} The encoded command request.
     * @throws {Error} If the resolver type is invalid.
     */
    private encodeCommandRequest;
    /**
     * Encodes the compute object.
     *
     * @returns {string} The encoded compute object.
     * @throws {Error} If the compute type is invalid.
     */
    private encodeCompute;
    /**
     * Encodes the command.
     *
     * @returns {string} The encoded command.
     */
    encode(): string;
    /**
     * Decodes a command request.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} offset - The offset to start decoding from.
     * @returns {CommandRequest} The decoded command request.
     * @throws {Error} If the resolver type is invalid.
     */
    private static decodeRequest;
    /**
     * Decodes the compute object.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} offset - The offset to start decoding from.
     * @returns {Compute} The decoded compute object.
     * @throws {Error} If the compute type is invalid.
     */
    private static decodeCompute;
    /**
     * Decodes a command.
     *
     * @param {string} hex - The hex string to decode.
     * @param {number} [offset=0] - The offset to start decoding from.
     * @returns {Command} The decoded command.
     */
    static decode(hex: string, offset?: number): Command;
}

export { Command, type CommandRequest, type ComposeOption, type Compute, ComputeEVM, ComputeHeader, ComputeSetting, ComputeType, type DataSize, EVMBase, type EVMBlock, type EVMTimestamp, type ExecutorLzReadOption, type ExecutorLzReceiveOption, type ExecutorNativeDropOption, ExecutorOptionType, type GasLimit, Header, type MessageOrigin, type NativeDrop, type Option, OptionType, Options, type Packet, type PacketHeader, type PacketPath, PacketSerializer, PacketV1Codec, type PreCrimePeer, type PrecrimeConfig, type PrecrimeConfigV1, type PrecrimeConfigV2, type PrecrimePacket, RequestHeader, ResolverType, SingleViewFunctionEVMCall, TimestampBlockConfiguration, type VerifierOption, VerifierOptionType, WorkerId, type WorkerOptions, addressToBytes32, bytes32ToEthAddress, calculateGuid, hexZeroPadTo32, isAptosAddress, isInitiaAddress, isSolanaAddress, isTonAddress, optionsType1, optionsType2, packetToMessageOrigin, parseError, parsePrecrimeConfig, trim0x };
