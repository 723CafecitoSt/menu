const data = window.CAFECITO_MENU;
const el = (tag, className, value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value) node.textContent = value;
  return node;
};
document.getElementById('event-title').textContent = data.event.name;
document.getElementById('event-details').textContent = data.event.details;
document.getElementById('event-map').href = data.event.map;
document.getElementById('menu-note').textContent = data.note;
const featured = document.getElementById('featured-list');
for (const item of data.featured) {
  const card = el('article', 'feature-card');
  const image = el('img', 'feature-image'); image.src = item.image; image.alt = item.alt; image.loading = 'lazy';
  const body = el('div', 'feature-body');
  const title = el('h3', '', item.name); const price = el('strong', '', item.price);
  const row = el('div', 'feature-row'); row.append(title, price);
  body.append(row, el('p', '', item.description)); card.append(image, body); featured.append(card);
}
const menu = document.getElementById('menu-list');
for (const category of data.categories) {
  const block = el('section', 'category'); block.append(el('h3', '', category.name));
  for (const [name, price, description] of category.items) {
    const item = el('div', 'menu-item'); const row = el('div', 'item-row');
    row.append(el('span', '', name), el('strong', '', price)); item.append(row);
    if (description) item.append(el('p', '', description)); block.append(item);
  }
  menu.append(block);
}
