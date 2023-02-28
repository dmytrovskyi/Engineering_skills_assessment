const { deterministicPartitionKey } = require("./dpk");

const test256CharsValidPartitionKey = 'X5F4tEAmyxJ9VoidbPh8Erbyzl9uquN36uv0zR59Bz6TBsmpdYuok3TGpcG6ZJaAWMhhDMLKTCWJeiy76V0SR8qFxNjrZRg4pYyenInNmC7RPHLY68rL50RFyHPrN4oaatmnU6yLLzbttkLWAIQ6HMFx3HVpVoFzJKFMFiHXB3ETqEFquvQosaJe2frlCoyBkym4pcdGVBi8l2UUjie1booYf07KVmGnWtDJWRQ5mGeOqOZ1BH6gAYT4LF407l3h';
const testTooLongPartitionKey = test256CharsValidPartitionKey + 'char';
const testObjectAsKey = {someField: 0};
const testEvent = {partitionKey: test256CharsValidPartitionKey};
const testEventWithNotStringPartitionKey = {partitionKey: testObjectAsKey}
const testEventWithTooLongPartitionKey = {partitionKey: testTooLongPartitionKey}
const testEmptyEvent = {};
const keyOfEmptyObject = 'c1802e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862';

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the key when given empty event", () => {
    const trivialKey = deterministicPartitionKey(testEmptyEvent);
    expect(trivialKey).not.toBe("0");
  });

  it("Returns the key when given event without partition key field", () => {
    const trivialKey = deterministicPartitionKey({someField: 0});
    expect(trivialKey).not.toBe("0");
  });

  it("Check if used sha3-512 algorithm", () => {
    const trivialKey = deterministicPartitionKey(testEmptyEvent);
    expect(trivialKey).toBe(keyOfEmptyObject);
  });

  it("Returns the valid key", () => {
    const trivialKey = deterministicPartitionKey(testEvent);
    expect(trivialKey).toBe(test256CharsValidPartitionKey);
  });

  it("Returns stringify json when event contains not string partition key with proper length", () => {
    const trivialKey = deterministicPartitionKey(testEventWithNotStringPartitionKey);
    expect(trivialKey).toEqual(JSON.stringify(testObjectAsKey));
  });

  it("Returns valid key when given not valid key", () => {
    const trivialKey = deterministicPartitionKey(testEventWithTooLongPartitionKey);
    expect(trivialKey).not.toBe(testTooLongPartitionKey);
    expect(trivialKey).toHaveLength(128);
  });
});
