import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async login({ email, password }: LoginDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { idToken, refreshToken, expiresIn } =
      await this.firebaseService.signInWithEmailAndPassword(email, password);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { idToken, refreshToken, expiresIn };
  }

  async logout(token: string) {
    const { uid } = await this.firebaseService.verifyIdToken(token);
    return await this.firebaseService.revokeRefreshToken(uid);
  }

  async refreshAuthToken(refreshToken: string) {
    return await this.firebaseService.refreshAuthToken(refreshToken);
  }
}
