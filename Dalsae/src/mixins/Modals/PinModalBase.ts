import { mixins } from 'vue-class-component';
import { Vue, Component, Inject, Emit } from 'vue-property-decorator';
import { DalsaePage } from '@/mixins';
import * as M from '@/Managers';
import store from '@/store';
import { moduleSwitter } from '@/store/modules/SwitterStore';
import { moduleModal } from '@/store/modules/ModalStore';

class State {
  pin: string;
  constructor() {
    this.pin = '';
  }
}

@Component
export class PinModalBase extends mixins(Vue, DalsaePage) {
  state = new State();

  @Inject()
  StartDalsae!: () => void;

  async ShowModal() {
    moduleSwitter.Reset();
    this.state.pin = '';
    // eslint-disable-next-line @typescript-eslint/camelcase
    const result = await this.api.call.oauth.ReqToken({ oauth_callback: 'oob' });
    if (!result.data) return;
    result.data.oauth_token_secret;
    console.log(result.data);
    window.preload.OpenBrowser(
      `https://api.twitter.com/oauth/authorize?oauth_token=${result.data.oauth_token}`
    );
    moduleSwitter.SetKey({
      publicKey: result.data.oauth_token,
      secretKey: result.data.oauth_token_secret
    });
    //아래 방법도 사용 가능
    // store.dispatch('SetKey', {
    //   publicKey: result.data.oauth_token,
    //   secretKey: result.data.oauth_token_secret
    // });
  }

  async GetAccessToken(pin: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const result = await this.api.call.oauth.ReqAccessToken({ oauth_verifier: pin });
    if (result.data) {
      window.preload.SaveSwitter(store.state.switter.switter);
      this.CloseModal();
    }
  }

  async ClickOk() {
    await this.GetAccessToken(this.state.pin);
    this.CloseModal();
    this.StartDalsae();
  }

  async ClickClose() {
    this.CloseModal();
  }

  async CloseModal() {
    moduleModal.ShowPinModal(false);
    this.state.pin = '';
  }
}
