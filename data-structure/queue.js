import DoublyLinkedList from "./doublylinkedlist.js";

export default class Queue {
  constructor() {
    this.list = new DoublyLinkedList();
  }

  head() {
    return this.list.head;
  }

  tail() {
    return this.list.tail;
  }

  enqueue(data) {
    this.list.addLast(data);
    return this.tail();
  }

  dequeue() {
    const node = this.head();
    this.list.removeFirst();
    return node;
  }

  peek() {
    return this.head().data;
  }

  size() {
    return this.list._size;
  }

  get(index) {
    return this.list.get(index);
  }

  clear() {
    while (this.size() > 0) {
      this.dequeue();
    }
  }
}
