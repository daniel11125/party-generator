let characters = [];

const roleMap = {
  "힐러": ["힐러", "사제", "음유시인"],
  "탱커": ["전사", "대검전사", "빙결술사", "수도사"],
  "딜러": ["검술사", "궁수", "석궁사수", "장궁병", "화염술사", "빙결술사", "수도사", "댄서", "악사", "마법사"]
};
//엔드포인트는 구글시트로 데이터 불러오기
fetch("https://api.sheetbest.com/sheets/776e2812-99b8-4f67-ae74-4b0fa2d6a060")
  .then(res => res.json())
  .then(data => {
    characters = data.map(c => ({
      id: c.id,
      class: c.class,
      power: Number(c.power)
    }));
    console.log("✅ 캐릭터 로딩 완료", characters);
  })
  .catch(err => {
    console.error("❌ 캐릭터 데이터 불러오기 실패", err);
  });

//역할별 필터링
function filterByRole(role) {
  return characters.filter(c => roleMap[role].includes(c.class));
}

// 중복 없이 N명 랜덤 추출
function getRandomUnique(arr, count, excluded = []) {
  const available = arr.filter(c => !excluded.includes(c.id));
  const shuffled = available.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 랜덤 파티 구성
function generateParty() {
  if (characters.length === 0) {
    alert("⏳ 캐릭터 데이터를 아직 불러오지 못했습니다.");
    return;
  }

  const selected = [];

  const dealerList = filterByRole("딜러");
  const tankList = filterByRole("탱커");
  const healerList = filterByRole("힐러");

  const dealers = getRandomUnique(dealerList, 2);
  selected.push(...dealers);

  const tank = getRandomUnique(tankList, 1, selected.map(c => c.id))[0];
  const healer = getRandomUnique(he
