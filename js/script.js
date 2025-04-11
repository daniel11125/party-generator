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
      thumbnail: c.thumbnail || null
    }));
    console.log("✅ 캐릭터 로딩 완료", characters);
  })
  .catch(err => {
    console.error("❌ 캐릭터 데이터 불러오기 실패", err);
  });

function filterByRole(role) {
  const list = roleMap[role];
  if (!list) {
    console.error(`❌ roleMap에 '${role}'이 존재하지 않음`);
    return [];
  }
  return characters.filter(c => list.includes(c.class));
}

function getRandomUnique(arr, count, excluded = []) {
  const available = arr.filter(c => !excluded.includes(c.id));
  const shuffled = available.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateParty() {
  if (!characters || characters.length === 0) {
    alert("⏳ 캐릭터 데이터를 아직 불러오지 못했습니다.");
    return;
  }

  const partyEl = document.getElementById("party");
  partyEl.innerHTML = `<div id="card-container" style="display: flex; flex-wrap: nowrap; justify-content: center; gap: 10px;"></div>`;
  const container = document.getElementById("card-container");

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

  selected.forEach((c, i) => {
    const roleIcon = i < 2 ? "🗡️" : i === 2 ? "🛡️" : "✨";
    const roleLabel = i < 2 ? "딜러" : i === 2 ? "탱커" : "힐러";

    let stars = 3;
    if (c.power >= 19000) stars = 4;
    if (c.power >= 21000) stars = 5;
    if (c.power >= 23000) stars = 6;
    const starOverlay = '★'.repeat(stars);

    const cardWrapper = document.createElement("div");
    cardWrapper.style.width = "200px";
    cardWrapper.style.display = "flex";
    cardWrapper.style.flexDirection = "column";
    cardWrapper.style.alignItems = "center";

    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "200px";
    card.style.height = "320px";
    card.style.position = "relative";
    card.style.borderRadius = "8px";
    card.style.overflow = "hidden";
    card.style.opacity = "0";
    card.style.transform = "scale(0.7) translateX(0)";
    card.style.transition = "all 0.6s ease";

    const inner = c.thumbnail
      ? `<img src="${c.thumbnail}" alt="${c.id}" style="width: 100%; height: 100%; object-fit: cover;">`
      : `<div style="width:100%; height:100%; background:#ccc;"></div>`;

    const topLeft = `<div style="position: absolute; top: 12px; left: 15px; background: rgba(0, 0, 0, 0.5); color: white; font-size: 13px; padding: 2px 6px; border-radius: 4px;">${c.class}</div>`;
    const topRight = `<div style="position: absolute; top: 12px; right: 15px; background: rgba(0, 0, 0, 0.5); color: white; font-size: 13px; padding: 2px 6px; border-radius: 4px;">${c.id}</div>`;

    const bottomOverlay = `
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 140px; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); display: flex; align-items: flex-end; justify-content: space-between; padding: 10px 15px 15px; box-sizing: border-box; font-size: 12px; font-weight: bold;">
        <div style="color: white; font-size: 13px;">${roleIcon} ${roleLabel}</div>
        <div style="color: gold; text-align: right; line-height: 1.3;">
          <div style="font-size: 20px; font-style: italic;">${c.power}</div>
          <div>${starOverlay}</div>
        </div>
      </div>
    `;

    card.innerHTML = inner + topLeft + topRight + bottomOverlay;
    cardWrapper.appendChild(card);
    container.appendChild(cardWrapper);

    setTimeout(() => {
      const spreadX = (i - 1.5) * 50; // 줄어든 퍼짐 거리
      card.style.opacity = "1";
      card.style.transform = `scale(1) translateX(${spreadX}px) rotateY(360deg)`;
    }, i * 400);
  });

  setTimeout(() => {
    partyEl.insertAdjacentHTML("beforeend", `<p style="margin-top: 30px; text-align: center;"><strong>⚔️ 총 전투력: ${totalPower}</strong></p>`);
  }, selected.length * 400);
}
