import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithCustomToken, createUserWithEmailAndPassword  } from "firebase/auth"
import environment from '~/src/environment';
import { AuthenticationError, AuthenticationErrorCode } from '../authentication/types/AuthenticationError';
import { InternalError } from '../errors/ConfigurationError';
import { IFirebaseConfig } from './IFirebaseConfig';

export class FirebaseClient {
  // private app: FirebaseApp;
  // constructor(
  //   firebaseConfig: IFirebaseConfig,
  //   name?: string
  // ) {
  //     this.app = initializeApp(firebaseConfig, name);
  // }

  // public async signIn(email: string, password: string): Promise<string> {
  //   try {
  //     const auth = getAuth(this.app);
  //     const cred = await signInWithEmailAndPassword(auth, email, password);
  //     if (cred == null) throw new InternalError('Expecting a Credential'); // not expected (should throw error first)
  //     if (cred.user == null) throw new InternalError('Expecting a User'); // not expected
  //     const token = await cred.user?.getIdToken();

  //     if (token == null || token.length == 0) throw new InternalError('Expecting a Token');

  //     // TODO: Validate Token Here
      
  //     return token;
  //   } catch (error: any) {
  //     throw this.convertError(error);
  //   }
  // }

  // private convertError(error: any): AuthenticationError {
  //   if (error.name === 'AuthenticationError') { 
  //     return error;
  //   }

  //   if (error.name === 'InternalError') {
  //     // TODO: determine if these should be logged
  //     return new AuthenticationError('xUnable to Log In', AuthenticationErrorCode.Other);
  //   }

  //   const code = error?.code;
  //   if (code != null) {
  //     switch (code) {
  //       // common firebase errors
  //       case 'auth/user-not-found': return new AuthenticationError('Invalid Username or Password', AuthenticationErrorCode.Fail);
  //       case 'auth/wrong-password': return new AuthenticationError('Invalid Username or Password', AuthenticationErrorCode.Fail); // NOTE: firebase returns 'wrong-password' for valid user accounts. This may be a security concern since it confirms an account exists.
  //       case 'auth/invalid-email' : return new AuthenticationError('Invalid Email Address', AuthenticationErrorCode.BadEmail);
  //       case 'auth/too-many-requests' : return new AuthenticationError('Too many attempts. Please try again later.', AuthenticationErrorCode.Other);
  //       case 'auth/weak-password': return new AuthenticationError('Weak Password. Please choose a more secure password', AuthenticationErrorCode.WeakPassword);
  //       case 'auth/email-already-in-use': return new AuthenticationError('The email address is used by another account.', AuthenticationErrorCode.EmailInUse);
  //     }
  //   }

  //   return new AuthenticationError('Unable to Log In (FC.01)', AuthenticationErrorCode.Other);
  // }

  // public async signInWithToken(customToken: string): Promise<string> {
  //   try {
  //     const auth = getAuth(this.app);
  //     const cred = await signInWithCustomToken(auth, customToken);
  //     if (cred == null) throw new InternalError('Expecting a Credential'); // not expected (should throw error first)
  //     if (cred.user == null) throw new InternalError('Expecting a User'); // not expected
  //     const token = await cred.user?.getIdToken();

  //     if (token == null || token.length == 0) throw new InternalError('Expecting a Token');

  //     // TODO: Validate Token Here
      
  //     return token;
  //   } catch (error: any) {
  //     throw this.convertError(error);
  //   }
  // }


  // public async signUp(email: string, password: string): Promise<string> {
  //   try {
  //     const auth = getAuth(this.app);
  //     const cred = await createUserWithEmailAndPassword(auth, email, password);
  //     if (cred == null) throw new InternalError('Expecting a Credential'); // not expected (should throw error first)
  //     if (cred.user == null) throw new InternalError('Expecting a User'); // not expected
  //     const token = await cred.user?.getIdToken();
  //     if (token == null || token.length == 0) throw new InternalError('Expecting a Token');
  //     // TODO: Validate Token Here
  //     return token;
  //   } catch (error: any) {
  //     throw this.convertError(error);
  //   }
  // }


  // public async signOut() {
  //   try {
  //     const auth = getAuth(this.app);
  //     await auth.signOut();
  //   } catch(error: any) {
  //     throw this.convertError(error)
  //   }
    
  // }

}

export const firebaseClient = new FirebaseClient();
// export const firebaseClient = new FirebaseClient({
//   apiKey: environment.firebase.webApiKey,
//   authDomain: environment.firebase.authDomain,
//   projectId: environment.firebase.projectId,
// });
