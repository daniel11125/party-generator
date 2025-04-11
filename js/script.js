let characters = [];

const roleMap = {
  "힐러": ["힐러", "사제", "음유시인"],
  "탱커": ["전사", "대검전사", "빙결술사", "수도사"],
  "딜러": ["검술사", "대검전사", "궁수", "석궁사수", "장궁병", "화염술사", "빙결술사", "수도사", "댄서", "악사", "마법사"]
};

fetch("https://api.sheetbest.com/sheets/776e2812-99b8-4f67-ae74-4b0fa2d6a060")
  .then(res => res.json())
  .then(data => {
    characters = data.map(c => ({
      id: c.id,
      class: c.class,
      power: Number(c.power),
      thumbnail: c.thumbnail || null  // 썸네일이 없으면 null 처리
    }));
    console.log("✅ 캐릭터 로딩 완료", characters);
  })
  .catch(err => {
    console.error("❌ 캐릭터 데이터 불러오기 실패", err);
  });

function filterByRole(role) {
  return characters.filter(c => roleMap[role].includes(c.class));
}

function getRandomUnique(arr, count, excluded = []) {
  const available = arr.filter(c => !excluded.includes(c.id));
  const shuffled = available.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

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

  const html = selected.map((c, i) => {
    const role = i < 2 ? "🗡️ 딜러" : i === 2 ? "🛡️ 탱커" : "✨ 힐러";
    const imageElement = c.thumbnail
      ? `<img src="${c.thumbnail}" alt="${c.id}" width="200" height="200" style="border-radius: 8px; object-fit: cover;" />`
      : `<div style="width:200px; height:200px; background:#ccc; border-radius:8px;"></div>`;

    return `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        ${imageElement}
        <div>
          <p><strong>${role}</strong></p>
          <p>${c.id} (${c.class})</p>
          <p>전투력: ${c.power}</p>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("party").innerHTML = `
    ${html}
    <p><strong>⚔️ 총 전투력: ${totalPower}</strong></p>
  `;
}
