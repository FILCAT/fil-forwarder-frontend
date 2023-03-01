import { FilForwarder } from '../services/FilForwarder.js';
import {
  usePrepareContractWrite,
  useContractWrite
} from 'wagmi';

/**
 * useForward
 *
 * This hook is used when you want to call the FilForwarder contract
 * 'forward' method.
 *
 * @param destination the bytes formatted address you want to send FIL to.
 * @param amount      the amount of FIL, in wei (as BigNumber) you want to send.
 * @param whenError   the function you want to call when an error occurs.
 * @param whenSuccess the function you want to call when the broadcast is successful.
 */
export function useForward(destination, amount, enabled, whenError, whenSuccess) {
  const preparation = usePrepareContractWrite(
    FilForwarder.getContractWrite(destination, amount, enabled));

  return useContractWrite({...preparation.config,
    onError(error) {
      whenError(error);
    },
    onSuccess(data) {
      whenSuccess(data);
    }
  });
}
