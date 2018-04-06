let counter = 0;

export default function createKey() {
  return `${++counter}`;
}
