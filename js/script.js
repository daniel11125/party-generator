let characters = [];

const roleMap = {
  "힐러": ["힐러", "사제", "음유시인"],
  "탱커": ["전사", "대검전사", "빙결술사", "수도사"],
  "딜러": ["검술사", "대검전사", "궁수", "석궁사수", "장궁병", "화염술사", "빙결술사", "수도사", "댄서", "악사", "마법사"]
};

// ✅ 캐릭터 데이터 불러오기
fetch("https://api.sheetbest.com/sheets/776e2812-99b8-4f67-ae74-4b0fa2d6a060")
  .then(res => res.json())
  .then(data => {
    characters = data.map(c => ({
      id: c.id,
      class: c.class,
      power: Number(c.power),
      thumbnail: c.thumbnail || null
    }));
    console.log("✅ 캐릭터 로딩 완료", characters);
  })
  .catch(err => {
    console.error("❌ 캐릭터 데이터 불러오기 실패", err);
  });

// ✅ 역할 필터링
function filterByRole(role) {
  return characters.filter(c => roleMap[role].includes(c.class));
}

// ✅ 중복 없는 랜덤 선택
function getRandomUnique(arr, count, excluded = []) {
  const available = arr.filter(c => !excluded.includes(c.id));
  const shuffled = available.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ✅ 랜덤 파티 생성
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
  const healer = getRandomUnique(healerList, 1, selected.map(c => c.id).concat(tank.id))[0];

  selected.push(tank, healer);

  const totalPower = selected.reduce((sum, c) => sum + c.power, 0);

  const html = `
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
      ${selected.map((c, i) => {
        const roleIcon = i < 2 ? "🗡️" : i === 2 ? "🛡️" : "✨";
        const roleLabel = i < 2 ? "딜러" : i === 2 ? "탱커" : "힐러";

        // ⭐ 별 개수 계산
        let stars = 3;
        if (c.power >= 19000) stars = 4;
        if (c.power >= 21000) stars = 5;
        if (c.power >= 23000) stars = 6;
        const starOverlay = '★'.repeat(stars);

        // 카드 이미지 + 클래스명 + 하단 정보
        const imageElement = `
          <div style="width:200px; height:320px; position: relative; border-radius: 8px; overflow: hidden;">
            ${
              c.thumbnail
                ? `<img src="${c.thumbnail}" alt="${c.id}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<div style="width:100%; height:100%; background:#ccc;"></div>`
            }

            <!-- 좌측 상단 클래스명 -->
            <div style="
              position: absolute;
              top: 15px;
              left: 15px;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              font-size: 13px;
              padding: 2px 6px;
              border-radius: 4px;
            ">
              ${c.class}
            </div>

            <div style="
              position: absolute;
              top: 15px;
              right: 15px;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              font-size: 13px;
              padding: 2px 6px;
              border-radius: 4px;
            ">
              ${c.id}
            </div>


            <!-- 하단 오버레이: 역할 / 전투력 / 별 -->
            <div style="
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 140px;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 10px 15px 15px;
  box-sizing: border-box;
  font-size: 12px;
  font-weight: bold;
">
                <div style="color: white; font-size: 13px;">${roleIcon} ${roleLabel}</div>
  <div style="color: gold; text-align: right; line-height: 1.2;">
    <div style="font-size:  15px;">${c.power}</div>
    <div>${starOverlay}</div>
  </div>


            </div>
          </div>
        `;

        return `
          <div style="width: 220px; display: flex; flex-direction: column; align-items: flex-start;">
            ${imageElement}
            <div style="margin-top: 10px; text-align: left; display: none;">
              <p><strong>${roleIcon} ${roleLabel}</strong></p>
              <p>${c.id}</p>
            </div>
          </div>
        `;
      }).join("")}
    </div>
    <p style="margin-top: 30px; text-align: center;"><strong>⚔️ 총 전투력: ${totalPower}</strong></p>
  `;

  document.getElementById("party").innerHTML = html;
}
