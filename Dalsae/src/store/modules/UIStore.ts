/* eslint-disable @typescript-eslint/camelcase */
import * as I from '@/Interfaces';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import * as M from '@/mixins';
import store from '@/store';
import { ETweetType, ChangeIndex, ContextEvent } from '@/store/Interface';
import { moduleTweet } from '@/store/modules/TweetStore';

export interface IPanelState {
  tweetType: ETweetType;
  index: number;
  selectedId: string;
}

interface StateContext {
  tweet: I.Tweet;
  index: number;
  maxIndex: number;
  isShow: boolean;
  x: number;
  y: number;
}

interface StateInput {
  replyTweet: I.Tweet;
  inputText: string;
  listImage: string[];
}

@Module({ dynamic: true, store, name: 'ui' })
class UIStore extends VuexModule {
  // states
  selectMenu = 0;
  panelHome: IPanelState = { tweetType: ETweetType.E_HOME, index: -1, selectedId: '' };
  panelMention: IPanelState = { tweetType: ETweetType.E_MENTION, index: -1, selectedId: '' };
  panelDm: IPanelState = { tweetType: ETweetType.E_DM, index: -1, selectedId: '' };
  panelFavorite: IPanelState = { tweetType: ETweetType.E_FAVORITE, index: -1, selectedId: '' };
  panelOpen: IPanelState = { tweetType: ETweetType.E_OPEN, index: -1, selectedId: '' };

  stateContext: StateContext = {
    tweet: new I.Tweet(),
    index: 0,
    maxIndex: 0,
    isShow: false,
    x: 0,
    y: 0
  };

  stateInput: StateInput = {
    inputText: '',
    listImage: [],
    replyTweet: new I.Tweet()
  };

  @Mutation
  private changeMenu(menu: number) {
    this.selectMenu = menu;
  }
  @Action
  ChangeMenu(menu: number) {
    this.context.commit('changeMenu', menu);
  }

  @Mutation
  private changeIndex(change: ChangeIndex) {
    if (change.index < 0) {
      change.index = 0;
    }
    switch (change.tweetType) {
      case ETweetType.E_HOME:
        this.panelHome.index = change.index;
        this.panelHome.selectedId = change.selectedId;
        break;
      case ETweetType.E_MENTION:
        this.panelMention.index = change.index;
        this.panelMention.selectedId = change.selectedId;
        break;
      case ETweetType.E_DM:
        this.panelDm.index = change.index;
        break;
      case ETweetType.E_FAVORITE:
        this.panelFavorite.index = change.index;
        this.panelFavorite.selectedId = change.selectedId;
        break;
      case ETweetType.E_OPEN:
        this.panelOpen.index = change.index;
        this.panelOpen.selectedId = change.selectedId;
        break;
    }
  }

  @Action
  ChangeIndex(change: ChangeIndex) {
    this.context.commit('changeIndex', change);
  }

  @Action
  ChangeSelectTweet(change: ChangeIndex) {
    let listTweet: M.ScrollItem<I.Tweet>[] = [];
    switch (change.tweetType) {
      case ETweetType.E_HOME:
        listTweet = moduleTweet.homes;
        break;
      case ETweetType.E_MENTION:
        listTweet = moduleTweet.mentions;
        break;
      case ETweetType.E_DM:
        break;
      case ETweetType.E_FAVORITE:
        listTweet = moduleTweet.favorites;
        break;
      case ETweetType.E_OPEN:
        listTweet = moduleTweet.opens;
        break;
      default:
        listTweet = moduleTweet.homes;
        break;
    }
    change.index = listTweet.findIndex(x => x.key === change.selectedId);
    if (change.index === -1) return;
    this.context.commit('changeIndex', change);
  }

  @Mutation
  private onContext(contextEvent: ContextEvent) {
    this.stateContext.index = 0;
    this.stateContext.isShow = contextEvent.isShow;
    if (contextEvent.tweet) {
      this.stateContext.tweet = contextEvent.tweet;
    }
    this.stateContext.x = contextEvent.x;
    this.stateContext.y = contextEvent.y;
    this.stateContext.maxIndex = contextEvent.maxIndex;
  }

  @Action
  OnContext(contextEvent: ContextEvent) {
    this.context.commit('onContext', contextEvent);
  }

  @Mutation
  private changeContextIndex(index: number) {
    if (index < 0) index = 0;
    else if (index > this.stateContext.maxIndex) index = this.stateContext.maxIndex;

    this.stateContext.index = index;
  }

  @Action
  ChageContextIndex(index: number) {
    this.context.commit('changeContextIndex', index);
  }

  @Mutation
  private changeReplyTweet(tweet: I.Tweet) {
    this.stateInput.replyTweet = tweet;
  }

  @Action
  ChangeReplyTweet(tweet: I.Tweet) {
    this.context.commit('changeReplyTweet', tweet);
  }

  @Mutation
  private setInputText(text: string) {
    this.stateInput.inputText = text;
  }

  @Action
  SetInputText(text: string) {
    this.context.commit('setInputText', text);
  }

  @Mutation
  private setImage(listImage: string[]) {
    this.stateInput.listImage = listImage;
  }

  @Action
  SetImage(listImage: string[]) {
    this.context.commit('setImage', listImage);
  }
}

export const moduleUI = getModule(UIStore);
