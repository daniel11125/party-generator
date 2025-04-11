let characters = [];



function showRecallButtonOnly() {
  const newBtn = document.querySelector(".newparty");
  const recallBtn = document.querySelector(".recall");

  if (newBtn) newBtn.style.display = "none";
  if (recallBtn) recallBtn.style.display = "inline-block";
}





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
      thumbnail: c.thumbnail || null,
      msg: c.msg || ""
    }));
    console.log("✅ 캐릭터 로딩 완료", characters);

   showAllMembers();

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

function generatePartyFromDisplayedCards() {
  if (!characters || characters.length === 0) {
    alert("⏳ 캐릭터 데이터를 아직 불러오지 못했습니다.");
    return;
  }

  const dealerList = filterByRole("딜러");
  const tankList = filterByRole("탱커");
  const healerList = filterByRole("힐러");

  const selected = [];
  const dealers = getRandomUnique(dealerList, 2);
  selected.push(...dealers);

  const tank = getRandomUnique(tankList, 1, selected.map(c => c.id))[0];
  const healer = getRandomUnique(healerList, 1, selected.map(c => c.id).concat(tank.id))[0];
  selected.push(tank, healer);

  const selectedIds = selected.map(c => c.id);

  const cardContainer = document.getElementById("card-container") || document.getElementById("all-card-container");
  if (!cardContainer) {
    alert("카드 컨테이너를 찾을 수 없습니다.");
    return;
  }

  // 컨테이너 스타일 정렬
  cardContainer.style.display = "flex";
  cardContainer.style.flexWrap = "nowrap";
  cardContainer.style.justifyContent = "center";
  cardContainer.style.gap = "40px";
  cardContainer.style.marginTop = "60px";
  cardContainer.style.transition = "all 0.6s ease";

  const allCards = Array.from(cardContainer.querySelectorAll(".card"));
  const selectedCardElements = [];

  allCards.forEach((cardEl) => {
    const idText = cardEl.querySelector("div[style*='right: 15px']").textContent.trim();
    const isSelected = selectedIds.includes(idText);

    if (!isSelected) {
      // ❌ 사라질 카드: 아래로 내려가며 페이드아웃
      cardEl.style.transition = "transform 0.6s ease, opacity 0.6s ease";
      cardEl.style.transform = "translateY(100px)";
      cardEl.style.opacity = "0";
      setTimeout(() => {
        cardEl.parentElement.remove(); // .cardWrapperごと 제거
      }, 600);
    } else {
      // ✅ 남을 카드: 초기 설정
      selectedCardElements.push(cardEl);
      cardEl.style.opacity = "0";
      cardEl.style.transform = "scale(0.9)";
      cardEl.style.transition = "all 0.6s ease";
    }
  });

  // 🌈 무지개 오오라 스타일 적용
  selectedCardElements.forEach((cardEl, i) => {
    setTimeout(() => {
      cardEl.style.opacity = "1";
      cardEl.style.transform = "scale(1.05) rotateY(360deg)";
      cardEl.style.zIndex = "10";
  cardEl.style.border = "1px solid white";

      cardEl.style.boxShadow = `
            0 0 10px rgba(255, 255, 255, 0.4),
		  0 0 30px rgba(255, 255, 255, 0.2),
		  0 0 60px rgba(255, 255, 255, 0.1)
      `;
	  cardEl.style.animation = "glowPulse 3s ease-in-out infinite";

      // cardEl.style.animation = "rainbowGlow 1.5s infinite ease-in-out";
    }, 600 + i * 200);
  });

  // 총 전투력 출력
  const existingText = document.querySelector("#total-power-text");
  if (existingText) existingText.remove();

  const totalPower = selected.reduce((sum, c) => sum + c.power, 0);
  const totalEl = document.createElement("p");
  totalEl.id = "total-power-text";
  totalEl.style.marginTop = "30px";
  totalEl.style.textAlign = "center";
  totalEl.innerHTML = `<strong>⚔️ 총 전투력: ${totalPower}</strong>`;
  setTimeout(() => {
    cardContainer.parentElement.appendChild(totalEl);
  }, 600 + selectedCardElements.length * 200);

  showRecallButtonOnly(); // 파티 셔플 후 버튼 전환


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

  // 파티원 새로 뽑기
  const dealerList = filterByRole("딜러");
  const tankList = filterByRole("탱커");
  const healerList = filterByRole("힐러");

  const selected = [];
  const dealers = getRandomUnique(dealerList, 2);
  selected.push(...dealers);

  const tank = getRandomUnique(tankList, 1, selected.map(c => c.id))[0];
  const healer = getRandomUnique(healerList, 1, selected.map(c => c.id).concat(tank.id))[0];
  selected.push(tank, healer);

  // 카드 컨테이너 초기화
  const partyEl = document.getElementById("party");
  partyEl.innerHTML = `<div id="card-container" class="card-container" style="display: flex; justify-content: center; gap: 40px;"></div>`;
  const container = document.getElementById("card-container");

  selected.forEach((c, i) => {
    const role = Object.keys(roleMap).find(r => roleMap[r].includes(c.class)) || "기타";
    const roleIcon = role === "딜러" ? "🗡️" : role === "탱커" ? "🛡️" : "✨";

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
    card.style.transform = "scale(0.7)";
    card.style.transition = "all 0.6s ease";

    const inner = c.thumbnail
      ? `<img src="${c.thumbnail}" alt="${c.id}" style="width: 100%; height: 100%; object-fit: cover;">`
      : `
        <div style="width: 100%; height: 100%; background: #eee; display: flex; justify-content: center; align-items: center;">
          <img src="./img/logo.svg" alt="default-logo" style="width: 100px; height: auto;">
        </div>
      `;

    const topLeft = `<div style="position: absolute; top: 12px; left: 15px; background: rgba(0, 0, 0, 0.5); color: white; font-size: 13px; padding: 2px 6px; border-radius: 4px;">${c.class}</div>`;
    const topRight = `<div style="position: absolute; top: 12px; right: 15px; background: rgba(0, 0, 0, 0.5); color: white; font-size: 13px; padding: 2px 6px; border-radius: 4px;">${c.id}</div>`;

    const messageText = (c.msg && c.msg.trim() !== "") ? c.msg.replaceAll('\n', '<br>') : '....';
    const messageCenter = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);  color: white; font-size: 14px; padding: 6px 10px; border-radius: 6px; text-align: center; max-width: 90%; font-family: 'Nanum Myeongjo', 'serif';">&quot;${messageText}&quot;</div>`;

    const bottomOverlay = `
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 140px; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); display: flex; align-items: flex-end; justify-content: space-between; padding: 10px 15px 15px; box-sizing: border-box; font-size: 12px; font-weight: bold;">
        <div style="color: white; font-size: 13px;">${roleIcon} ${role}</div>
        <div style="color: gold; text-align: right; line-height: 1.3;">
          <div style="font-size: 20px; font-style: italic; font-family: 'Nanum Myeongjo';">${c.power}</div>
          <div>${starOverlay}</div>
        </div>
      </div>
    `;

    card.innerHTML = inner + topLeft + topRight + messageCenter + bottomOverlay;
    cardWrapper.appendChild(card);
    container.appendChild(cardWrapper);

    // 등장 애니메이션 + gold border
    setTimeout(() => {
	  card.style.opacity = "1";
	  card.style.transform = "scale(1.05) rotateY(360deg)";
	  card.style.zIndex = "10";
  card.style.border = "1px solid white";

	  card.style.boxShadow = `
            0 0 10px rgba(255, 255, 255, 0.4),
		  0 0 30px rgba(255, 255, 255, 0.2),
		  0 0 60px rgba(255, 255, 255, 0.1)
	  `;
	}, i * 200);
  });

  // 전투력 표시
  const totalPower = selected.reduce((sum, c) => sum + c.power, 0);
  const existingText = document.querySelector("#total-power-text");
  if (existingText) existingText.remove();

  const totalEl = document.createElement("p");
  totalEl.id = "total-power-text";
  totalEl.style.marginTop = "30px";
  totalEl.style.textAlign = "center";
  totalEl.innerHTML = `<strong>⚔️ 총 전투력: ${totalPower}</strong>`;
  setTimeout(() => {
    partyEl.appendChild(totalEl);
  }, selected.length * 200 + 300);

	setTimeout(() => {
	  const cards = document.querySelectorAll('.card');
	  cards.forEach(card => {
		card.classList.add('glow');
	  });
	}, selected.length * 200 + 400); // 살짝 여유 줘도 좋아

}




function showAllMembers() {
  if (!characters || characters.length === 0) {
    alert("⏳ 캐릭터 데이터를 아직 불러오지 못했습니다.");
    return;
  }

  const partyEl = document.getElementById("party");
  partyEl.innerHTML = `<div id="all-card-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;"></div>`;
  const container = document.getElementById("all-card-container");

  characters.forEach((c, i) => {
    const role = Object.entries(roleMap).find(([_, classes]) => classes.includes(c.class))?.[0] || "기타";
    const roleIcon = role === "딜러" ? "🗡️" : role === "탱커" ? "🛡️" : role === "힐러" ? "✨" : "❔";
    const roleLabel = role;

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
    card.style.transform = "scale(0.7) translateY(50px)";
    card.style.transition = "all 0.6s ease";



	const inner = c.thumbnail
	  ? `<img src="${c.thumbnail}" alt="${c.id}" style="width: 100%; height: 100%; object-fit: cover;">`
	  : `
		<div style="width: 100%; height: 100%; background: #eee; display: flex; justify-content: center; align-items: center;">
		  <img src="./img/logo.svg" alt="default-logo" style="width: 100px; height: auto;">
		</div>
	  `;


    const topLeft = `<div style="position: absolute; top: 12px; left: 15px; background: rgba(0, 0, 0, 0.5); color: white; font-size: 13px; padding: 2px 6px; border-radius: 4px;">${c.class}</div>`;
    const topRight = `<div style="position: absolute; top: 12px; right: 15px; background: rgba(0, 0, 0, 0.5); color: white; font-size: 13px; padding: 2px 6px; border-radius: 4px;">${c.id}</div>`;

    const messageText = (c.msg && c.msg.trim() !== "") ? c.msg.split('\n').join('<br>') : '....';
    const messageCenter = c.msg ? `<div style="min-width: 120px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 14px; padding: 6px 10px; border-radius: 6px; text-align: center; max-width: 90%; font-family: 'Nanum Myeongjo', 'serif';">&quot;${messageText}&quot;</div>` : "";

    const bottomOverlay = `
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 140px; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); display: flex; align-items: flex-end; justify-content: space-between; padding: 10px 15px 15px; box-sizing: border-box; font-size: 12px; font-weight: bold;">
        <div style="color: white; font-size: 13px;">${roleIcon} ${roleLabel}</div>
        <div style="color: gold; text-align: right; line-height: 1.3;">
          <div style="font-size: 20px; font-style: italic; font-family: 'Nanum Myeongjo';">${c.power}</div>
          <div>${starOverlay}</div>
        </div>
      </div>
    `;

    card.innerHTML = inner + topLeft + topRight + messageCenter + bottomOverlay;
    cardWrapper.appendChild(card);
    container.appendChild(cardWrapper);

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "scale(1) translateY(0)";
    }, i * 100);





  });
}

