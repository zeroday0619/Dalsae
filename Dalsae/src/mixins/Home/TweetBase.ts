import { Vue, Mixins, Component, Inject, Emit, Prop } from 'vue-property-decorator';
import * as MIX from '@/mixins';
import * as I from '@/Interfaces';
import moment from 'moment';

class State {
  isSelected: boolean;
  isFocus: boolean;
  constructor() {
    this.isFocus = false;
    this.isSelected = false;
  }
}

@Component
export class TweetBase extends Mixins(Vue, MIX.DalsaePage) {
  state: State = new State();
  @Prop()
  tweet!: I.Tweet;

  get orgTweet() {
    return this.tweet.retweeted_status ? this.tweet.retweeted_status : this.tweet; //원본 트윗 저장
  }

  get orgUser() {
    console.log('orgUser');
    return this.orgTweet.user;
  }

  get name() {
    return this.orgUser.screen_name + ' / ' + this.orgUser.name;
  }

  get date() {
    const locale = window.navigator.language;
    moment.locale(locale);
    const date = new Date(this.orgTweet.created_at);
    return moment(date).format('LLLL') + ':' + moment(date).format('ss');
  }

  get via() {
    let str = this.orgTweet.source;
    str = str.substring(str.indexOf('>') + 1, 999);
    str = str.substring(0, str.indexOf('<'));
    return ` / ${str}`;
    // source:"<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>"
    // return 'aaa';
  }

  get tweetText() {
    console.log('tweet text');
    let text = this.orgTweet.full_text;
    const entities = this.orgTweet.entities;
    entities.media.forEach(item => {
      text = text.replace(item.url, item.display_url);
    });
    entities.urls?.forEach(url => {
      text = text.replace(url.url, url.display_url);
    });
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    console.log(text);
    return text;
  }
}
