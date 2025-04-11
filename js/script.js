const characters = [
  { id: "킹횽", class: "검술사", power: 20679 },
  { id: "후추단추", class: "사제", power: 20058 },
  { id: "후하", class: "빙결술사", power: 18314 },
  { id: "히하콩", class: "화염술사", power: 11844 },
  { id: "띠링띵", class: "힐러", power: 17700 },
  { id: "라디오스", class: "검술사", power: 24196 },
  { id: "맹버퍼", class: "음유시인", power: 21470 },
  { id: "사누", class: "댄서", power: 18303 },
  { id: "손냥", class: "검술사", power: 22568 },
  { id: "쏘타", class: "수도사", power: 24212 },
  { id: "아젤리스", class: "석궁사수", power: 24540 },
  { id: "압제", class: "전사", power: 20411 },
  { id: "GoGeeManDoo", class: "화염술사", power: 6583 },
  { id: "Lyuan", class: "화염술사", power: 8372 },
  { id: "검방구", class: "전사", power: 11645 },
  { id: "던바튼지박령", class: "빙결술사", power: 22198 },
  { id: "가토", class: "장궁병", power: 21294 },
  { id: "께임", class: "댄서", power: 21146 },
  { id: "꼬꼬먀", class: "사제", power: 22651 },
  { id: "여히", class: "힐러", power: 13539 },
  { id: "윙치킨", class: "화염술사", power: 22320 },
  { id: "네미요", class: "석궁사수", power: 21032 },
  { id: "비숑", class: "화염술사", power: 18517 }
];

const roleMap = {
  "힐러": ["힐러", "사제", "음유시인"],
  "탱커": ["전사", "대검전사", "빙결술사", "수도사"],
  "딜러": ["검술사", "궁수", "석궁사수", "장궁병", "화염술사", "빙결술사", "수도사", "댄서", "악사", "마법사"]
};

function filterByRole(role) {
  return characters.filter(c => roleMap[role].includes(c.class));
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateParty() {
  const dealer = getRandom(filterByRole("딜러"));
  const tank = getRandom(filterByRole("탱커"));
  const healer = getRandom(filterByRole("힐러"));

  const total = dealer.power + tank.power + healer.power;

  document.getElementById("party").innerHTML = `
    <p>🗡️ <strong>딜러</strong>: ${dealer.id} (${dealer.class}, 전투력: ${dealer.power})</p>
    <p>🛡️ <strong>탱커</strong>: ${tank.id} (${tank.class}, 전투력: ${tank.power})</p>
    <p>✨ <strong>힐러</strong>: ${healer.id} (${healer.class}, 전투력: ${healer.power})</p>
    <p><strong>⚔️ 총 전투력: ${total}</strong></p>
  `;
}
