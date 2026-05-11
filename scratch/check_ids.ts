
import { allEquipments } from './src/data/equipments';

const ids = allEquipments.map(e => e.id).sort((a, b) => a - b);
const missing = [];
for (let i = 1; i <= 144; i++) {
  if (!ids.includes(i)) {
    missing.push(i);
  }
}
console.log('Missing IDs:', missing);
console.log('Total count:', allEquipments.length);
