import * as firebaseAdmin from 'firebase-admin';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateRequest,
  DecodedIdToken,
  UserRecord,
} from 'firebase-admin/lib/auth';
import { FirebaseConfigService } from './firebase-config.service';
import axios from 'axios';

@Injectable()
export class FirebaseService {
  private readonly apiKey: string;

  constructor(firebaseConfig: FirebaseConfigService) {
    this.apiKey = firebaseConfig.apiKey;
  }

  async createUser(props: CreateRequest): Promise<UserRecord> {
    return firebaseAdmin
      .auth()
      .createUser(props)
      .catch(this.handleFirebaseAuthError);
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    return firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .catch(this.handleFirebaseAuthError);
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<any> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    }).catch(this.handleRestApiError);
  }

  async revokeRefreshToken(uid: string) {
    return await firebaseAdmin
      .auth()
      .revokeRefreshTokens(uid)
      .catch(this.handleFirebaseAuthError);
  }

  async refreshAuthToken(refreshToken: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      id_token: idToken,
      refresh_token: newRefreshToken,
      expires_in: expiresIn,
    } = await this.sendRefreshAuthTokenRequest(refreshToken).catch(
      this.handleRestApiError,
    );
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      idToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      refreshToken: newRefreshToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expiresIn,
    };
  }

  private async sendRefreshAuthTokenRequest(refreshToken: string) {
    const url = `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`;
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.sendPostRequest(url, payload);
  }

  private async sendPostRequest(url: string, data: any): Promise<any> {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }

  private handleFirebaseAuthError = (error: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (error.code?.startsWith('auth/')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    throw new Error(error.message);
  };

  private handleRestApiError = (error: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.response?.data?.error?.code === 400) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const messageKey = error.response?.data?.error?.message;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message =
        {
          INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
          INVALID_REFRESH_TOKEN: 'Invalid refresh token',
          TOKEN_EXPIRED: 'Token expired',
          USER_DISABLED: 'User disabled',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        }[messageKey] ?? messageKey;
      throw new BadRequestException(message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    throw new Error(error.message);
  };
}
