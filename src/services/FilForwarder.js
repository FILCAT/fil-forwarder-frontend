import forwarder from './FilForwarder.json';

export const FilForwarder = (function() {
  // for security reasons, we are always going to assume
  // that FilForwarder resides at the same address.
  const filForwarderAddress = '0xAac40637A3590713f0588CF165E58f7A2c868d93';

  return {
    //////////////////////////////////////////
    // getContractAddress
    //
    // We want to be able to expose the contract address
    // for this service.
    //////////////////////////////////////////
    getContractAddress: function() {
      return filForwarderAddress;
    },
    ////////////////////////////////////////////
    // getContractWrite
    //
    // Given a contract alias, produce the
    // wagmi hash for the useContractWrite hook.
    //
    // @param destination - this is the fully bytes-transformed address that
    //                      comes out of the zondax izari tools API in byte format.
    // @param amount      - This should be a BigNumber from the ethers library
    //                      specifying the amount of FIL, in wei.
    // @param enabled     - true if you want to simulate the transaction (its ready),
    //                      false if the other parameters are not ready yet and you
    //                      don't want to spam the console with errors.
    ////////////////////////////////////////////
    getContractWrite: function(destination, amount, enabled) {
      return {
        addressOrName: filForwarderAddress, 
        contractInterface: forwarder.abi, 
        functionName: 'forward',
        args: [destination, {value: amount}],
        enabled: enabled,
        onError(error) {
          console.log("There was an error prepping a contract write.");
          console.log("Here are the raw destination and amount given:");
          console.log(destination);
          console.log(amount);
          console.log("Something really bad happened " + error);
        }
      }
    },
  }
})();

