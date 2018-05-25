// @flow
import RNfirebase from 'react-native-firebase';

export default async (message) => {
    // handle your message
    // This handler method must return a promise and resolve within 60 seconds.
    console.log("message", message);
    return Promise.resolve();
}
