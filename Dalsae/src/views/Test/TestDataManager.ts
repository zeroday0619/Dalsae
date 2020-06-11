interface Option {
  bShow: boolean;
}
interface Tweet {
  id: number;
  fullText: string;
  name: string;
}
export class DataMng {
  private static _instence: DataMng;
  private constructor() {
    console.log('a');
  }
  static Instence() {
    if (!DataMng._instence) {
      DataMng._instence = new DataMng();
    }
    return this._instence;
  }
  public TweetAdd(tweet: Tweet) {
    console.log('called tweet add');
    console.log(tweet);
    this.listTweet.push(tweet);
    console.log(this.listTweet);
  }
  option: Option = {
    bShow: false
  };
  listTweet: Tweet[] = [
    {
      id: 1,
      fullText: `'호사유피(虎死留皮)'라는 말이 있겠다.범이 죽어 가죽이 남았다면 그의 호문을 감정하여 '수남(壽男)'이라고 하랴? '복동(福童)'이라고 하랴? 범이란 범이 모조리 이름이 없었던 것이다.
      내가 시인 윤동주를 몰랐기로서니 윤동주의 시(詩)가 바로 '시'고 보면 그만 아니냐?`,
      name: '사람1'
    },
    {
      id: 2,
      fullText: `나도 모를 아픔을 오래 참다 처음으로 이곳에 찾아왔다.그러나 나의 늙은 의사는 젊은이의 병을 모른다.
      나한테는 병이 없다고 한다. 이 지나친 시련,이 지나친 피로,나는 성내서는 안 된다.
      ㅡ그의 유시 <병원>의 일절`,
      name: '사람1'
    },
    {
      id: 3,
      fullText: `"형님이 살았으면 몇 살인고?"
      "서른한 살입니다."
      "죽기는 스물아홉예요ㅡ."
      "간도(間島)에는 언제 가셨던고?"
      "할아버지 때요."
      "지내시기는 어떠했던고?"
      "할아버지가 개척하여 소지주(小地主) 정도였습니다."
      "아버지는 무얼 하시노?"
      "장사도 하시고 회사에도 다니시고 했지요."
      "아아,간도에 시와 애수와 같은 것이 발효하기 비롯한다면 윤동주와 같은 세대에서부텀이었구나!" 나는 감상하였다`,
      name: '사람1'
    },
    {
      id: 4,
      fullText: `스물여섯 적입니다."
    "무슨 연애 같은 것이나 있었나?"
    "하도 말이 없어서 모릅니다."
    "술은?"
    "먹는 것 못 보았습니다."
    "담배는?"
    "집에 와서는 어른들 때문에 피우는 것 못 보았습니다."
    "인색하진 않았나?"
    "누가 달라면 책이나 셔츠나 거저`,
      name: '사람1'
    },
    {
      id: 5,
      fullText: `"공부는?"
    "책을 보다가도 집에서나 남이 원하면 시간까지도 아까지 않습데다."
    "심술(心術)은?"
    "순하디 순하였습니다."
    "몸은?"
    "중학 때 축구 선수였습니다."
    "주책(主策)은?"
    "남이 하자는 대로 하다가도 함부로 속을 주지는`,
      name: '사람1'
    }
  ];
}