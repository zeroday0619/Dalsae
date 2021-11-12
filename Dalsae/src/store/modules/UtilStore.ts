/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';
import { moduleSwitter } from './SwitterStore';
import { moduleOption } from './OptionStore';
import { ContextItem, Messagetype } from '@/mixins';
import { moduleUI } from './UIStore';
import { moduleApi } from './APIStore';
import copy from 'copy-to-clipboard';
import { moduleProfile } from './ProfileStore';
import { moduleModal } from './ModalStore';
import { eventBus } from '@/plugins';
import { FindTweet } from '@/Interfaces';
import axios from 'axios';
import { moduleDom } from './DomStore';
import { decode } from 'html-entities';
@Module({ dynamic: true, store, name: 'util' })
class UtilStore extends VuexModule {
  get isFocusPanel() {
    const { bOption, stateMessage, bOptionDetail, bPin } = moduleModal;
    const { bAutoComplete } = moduleModal.stateAutoComplete;
    const { isShow } = moduleModal.stateAlert;
    if (
      bOption ||
      bAutoComplete ||
      stateMessage.bMessage ||
      bOption ||
      bOptionDetail ||
      bPin ||
      isShow
    )
      return false;
    return true;
  }
  @Action
  OpenImage(tweet: I.Tweet) {
    const media = tweet.orgTweet.extended_entities?.media;
    if (!media) return;
    if (media[0].type === 'photo') {
      window.ipc.image.OpenImageWindow(tweet, moduleOption.uiOption);
    } else {
      window.ipc.video.OpenVideoWindow(tweet, moduleOption.uiOption);
    }
  }
  @Action
  OnEnterByContext() {
    const { index, listContext } = moduleUI.stateContext;
    const context = listContext.find(x => x.value === index);
    context?.onClick(index);
    moduleUI.SetStateContext({
      ...moduleUI.stateContext,
      isShow: false,
      x: 0,
      y: 0,
      listContext: [],
      maxIndex: 0
    });
  }
  @Action
  OpenLink(tweet: I.Tweet, title: string) {
    const url = tweet.orgTweet.entities.urls.find(x => x.display_url === title);
    if (!url) return;
    window.ipc.browser.OpenBrowser(url.expanded_url);
  }
  @Action
  OnClickViewWeb(tweet: I.Tweet) {
    const url = `https://twitter.com/${tweet.orgUser.screen_name}/status/${tweet.orgTweet.id_str}`;
    window.ipc.browser.OpenBrowser(url);
  }
  @Action
  OnClickQt(tweet: I.Tweet) {
    const str = `https://twitter.com/${tweet.orgUser.screen_name}/status/${tweet.orgTweet.id_str}`;
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: str });
    moduleDom.stateDom.textArea.focus();
  }

  @Action
  Reply(tweet: I.Tweet) {
    const mentions = `@${tweet.orgUser.screen_name} `;
    moduleUI.SetStateInput({ ...moduleUI.stateInput, replyTweet: tweet, inputText: mentions });
    moduleDom.stateDom.textArea.focus();
  }

  @Action
  ReplyAll(tweet: I.Tweet) {
    const set = new Set();
    set.add(tweet.user.screen_name);
    set.add(tweet.orgUser.screen_name);
    tweet.orgTweet.entities.user_mentions.forEach(user => {
      set.add(user.screen_name);
    });
    const screenName = moduleSwitter.selectUser?.user.screen_name;
    if (screenName) set.delete(screenName);
    let mentions = '';
    set.forEach(user => {
      mentions += `@${user} `;
    });
    moduleUI.SetStateInput({ ...moduleUI.stateInput, replyTweet: tweet, inputText: mentions });
    moduleDom.stateDom.textArea.focus();
  }
  @Action
  LoadTweets() {
    let id_str = '';
    switch (moduleUI.stateUI.selectMenu) {
      case 0:
        if (moduleTweet.homes && moduleTweet.homes.length > 0) id_str = moduleTweet.homes[0].id_str;
        moduleApi.statuses.TimeLine('', id_str);
        break;
      case 1:
        if (moduleTweet.mentions && moduleTweet.mentions.length > 0)
          id_str = moduleTweet.mentions[0].id_str;
        moduleApi.statuses.Mention('', id_str);
        break;
      case 3:
        if (moduleTweet.favorites && moduleTweet.favorites.length > 0)
          id_str = moduleTweet.favorites[0].id_str;
        moduleApi.favorites.List('', id_str);
        break;
    }
  }

  ///대화 불러오기
  @Action
  LoadConv(tweet: I.Tweet) {
    moduleTweet.AddConv({
      listTweet: undefined,
      tweet: tweet,
      type: ETweetType.E_CONV,
      user_id_str: moduleSwitter.selectID
    });
    let id_str = tweet.orgTweet.in_reply_to_status_id_str;
    if (!id_str) return;
    let find = FindTweet(id_str, moduleSwitter.selectID, moduleTweet.homes, moduleTweet.mentions);
    while (find) {
      moduleTweet.AddConv({
        listTweet: undefined,
        tweet: find,
        type: ETweetType.E_CONV,
        user_id_str: moduleSwitter.selectID
      });
      id_str = find.in_reply_to_status_id_str;
      find = FindTweet(id_str, moduleSwitter.selectID, moduleTweet.homes, moduleTweet.mentions);
    }
    if (id_str && !find) {
      moduleApi.statuses.Show(id_str);
    }
  }

  @Action
  CopyTweet(tweet: I.Tweet) {
    let text = tweet.orgTweet.full_text;
    text = text;
    tweet.entities.urls.forEach(url => {
      text = text.replace(url.url, url.expanded_url);
    });
    if (tweet.media) {
      tweet.media.forEach(media => {
        text = text.replace(media.url, media.display_url);
      });
    }
    text = decode(text);
    copy(text);
    moduleModal.AddMessage({
      message: '트윗이 복사되었습니다',
      time: 1,
      errorType: Messagetype.E_INFO
    });
  }

  @Action
  AddHashs(tweet: I.Tweet) {
    if (!tweet.entities.hashtags.length) return;
    let text = '';
    tweet.entities.hashtags.forEach(hash => {
      text += `#${hash.text} `;
    });
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: text });
    moduleDom.stateDom.textArea.focus();
  }

  @Action
  AddHash(hash: I.Hashtag) {
    if (!hash) return;
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: `#${hash.text}` });
    moduleDom.stateDom.textArea.focus();
  }

  @Action
  Follow(user: I.User) {
    if (!user) return;
    if (moduleProfile.stateProfile.isFollwRequest) return; //글로벌로 요청 중
    const isFollowing = moduleProfile.listFollowingIds.ids.findIndex(x => x === user.id_str) > -1;
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isFollwRequest: true });
    if (isFollowing) {
      moduleApi.friendships.Destroy({ screen_name: user.screen_name });
    } else {
      moduleApi.friendships.Create({ screen_name: user.screen_name });
    }
    moduleProfile.SetState({ ...moduleProfile.stateProfile, isFollwRequest: false });
  }

  @Action
  AutoCompleted(user: I.User | undefined) {
    if (!moduleModal.stateAutoComplete.bAutoComplete) return;
    let text = moduleUI.stateInput.inputText;
    const { autoCompleteWord, indexAutoComplete } = moduleModal.stateAutoComplete;
    if (!user) {
      user = moduleModal.users[indexAutoComplete];
    }
    text = text.replace(`@${autoCompleteWord}`, `@${user.screen_name} `);
    moduleModal.SetAutoComplete({
      ...moduleModal.stateAutoComplete,
      bAutoComplete: false,
      autoCompleteWord: ''
    });
    moduleUI.SetStateInput({ ...moduleUI.stateInput, inputText: text });
    moduleDom.stateDom.textArea.focus();
  }
  @Action
  Retweet(tweet: I.Tweet | undefined) {
    if (!tweet) return;
    const { isSendRTCheck, isSendRTProtected } = moduleOption.uiOption;
    if (!isSendRTProtected && tweet.orgUser.protected) {
      moduleModal.AddMessage({
        errorType: Messagetype.E_WARNING,
        message: '잠금 사용자의 트윗은 리트윗 할 수 없습니다.',
        time: 2
      });
    } else if (isSendRTProtected && tweet.orgUser.protected) {
      this.CheckProtectRetweet(tweet);
    } else if (isSendRTCheck) {
      this.CheckRetweet(tweet);
    } else {
      moduleApi.statuses.Retweet(tweet);
    }
  }

  @Action
  CheckProtectRetweet(tweet: I.Tweet) {
    moduleModal.SetStateAlert({
      isShow: true,
      isYesNo: true,
      message: '잠금 사용자의 트윗을 복사하여 트윗 하시겠습니까?',
      title: '잠금 사용자의 트윗 리트윗',
      callback: (b: boolean) => {
        if (b) {
          this.RetweetProtected(tweet);
        }
      }
    });
  }

  @Action
  async RetweetProtected(tweet: I.Tweet) {
    let text = `@**: ${tweet.orgTweet.full_text}`;
    text = text;
    tweet.entities.urls.forEach(url => {
      text = text.replace(url.url, url.expanded_url);
    });
    if (tweet.media) {
      tweet.media.forEach(media => {
        text = text.replace(media.url, '');
      });
    }
    const listMedia: string[] = [];
    if (tweet.media) {
      for (let i = 0; i < tweet.media.length; i++) {
        const url = tweet.media[i].media_url_https;
        const result = await axios.get(url, { responseType: 'blob' });
        const base64 = (await this.readFileAsync(result.data)) as string;
        listMedia.push(base64);
      }
    }
    moduleApi.statuses.Update(text, listMedia);
  }

  @Action
  private readFileAsync(data: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(data);
    });
  }

  @Action
  CheckRetweet(tweet: I.Tweet) {
    const { full_text } = tweet.orgTweet;
    let message = full_text.substring(0, 20);
    if (full_text.length > 20) {
      message += '...';
    }
    if (tweet.orgTweet.retweeted) {
      message = `${message} 를 리트윗 취소 하시겠습니까?`;
    } else {
      message = `${message} 를 리트윗 하시겠습니까?`;
    }
    moduleModal.SetStateAlert({
      isShow: true,
      isYesNo: true,
      title: '리트윗 확인',
      message: message,
      callback: (b: boolean) => {
        if (b) {
          moduleApi.statuses.Retweet(tweet);
        }
      }
    });
  }
}
export const moduleUtil = getModule(UtilStore);
