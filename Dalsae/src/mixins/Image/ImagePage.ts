import { Vue, Mixins, Component, Inject, Emit, Prop, Provide } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';

class State {
  download: number;
  constructor() {
    this.download = 0;
  }
}

@Component
export class ImagePage extends Vue {
  state = new State();
  tweet!: I.Tweet;
  option: I.UIOption = {
    isBigPropic: true,
    isLoadOrgImg: false,
    isSendCheck: false,
    isSendEnter: true,
    isSendRTCheck: true,
    isSendRTProtected: true,
    isShowBottomPreview: true,
    isShowPreview: true,
    isShowPropic: true,
    isShowTweet: true,
    isSmallInput: false,
    isSmallTweet: false,
    isUseRead: false
  };
  index = 0;
  get orgTweet() {
    return this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet; //원본 트윗 저장
  }

  get media() {
    return this.orgTweet.extended_entities.media;
  }

  OnPrev() {
    this.index--;
    if (this.index < 0) {
      this.index = 0;
    }
  }

  OnNext() {
    this.index++;
    if (this.index >= this.media.length) {
      this.index = this.media.length - 1;
    }
  }
  OnClickMedia(media: I.Media) {
    const index = this.media.findIndex(x => x.id_str === media.id_str);
    if (index > -1) this.index = index;
  }
}
