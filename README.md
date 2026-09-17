# ikukamo-now

「今すぐ行ける」を全国で宽く探すお出かけ候補アプリ。
ikukamo の既存コードを流用して、豊橋固定を廃て「今の位置から車なし・雨でも・予算1000円内・1時間以内」で絞る。

## アイデア
- モットは「今すぐ行ける順」リスト（地図ではなく）
- 気分ボタン3つ（閒・飲みたい・動きたくない）で絞る
- フィードバックは「行った」「微妙」だけ
- adapters に Google Maps Places / Meetup / Eventbrite / Connpass / Peatix / Xローカル検索を追加予定

## ステータス
- 既存 ikukamo はそのまま。これは別リポ。
- スコアリングは「今の位置からの距離」中心。

## ローカル起動
```bash
npm install
npm run dev
```

## ロードマップ
- [ ] Google Places adapter
- [ ] Connpass / Peatix / Eventbrite
- [ ] 雨天フィルタ
- [ ] 予算フィルタ
- [ ] 気分ボタン
