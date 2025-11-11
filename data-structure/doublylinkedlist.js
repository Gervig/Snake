export default class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  // Helper method to create a new node
  _createNode(data, next = null, prev = null) {
    return { data, next, prev };
  }

  size() {
    return this._size;
  }

  printList() {
    // start at the head
    let current = this.head;
    let index = 0;
    // if there is a node at head, runs while loop
    while (current) {
      // prints the index & and data for current node
      // and an arrow if it has a next, if not prints null
      console.log(
        `[${index}] data: ${JSON.stringify(current.data)}, next: ${
          current.next ? "→" : "null"
        }`
      );
      // moves to next node, exits if it's null
      current = current.next;
      index++;
    }
    // prints for empty list
    if (this._size === 0) console.log("(empty list)");
  }

  addLast(data) {
    const newNode = this._createNode(data);

    // if the list doesn't have a tail, sets new node as tail and head
    if (!this.tail && !this.head) {
      this.tail = newNode;
      this.head = newNode;
      // sets the tail's next as new node
      // sets new node's prev as the old tail
      // finally overwrites the tail variable as the new node
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    // size of list goes up
    this._size++;
  }

  addFirst(data) {
    const newNode = this._createNode(data);

    // if the list doesn't have a head, sets new node as head and tail
    if (!this.tail && !this.head) {
      this.tail = newNode;
      this.head = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
    // size of list goes up
    this._size++;
  }

  get(index) {
    // finds the node at the index
    const node = this.getNode(index);
    // if it's not null, returns its data
    if (node != null) {
      return node.data;
    } else {
      // if it's null, return undefined
      return undefined;
    }
  }

  getFirst() {
    return this.head ? this.head.data : null;
  }

  getLast() {
    return this.tail ? this.tail.data : null;
  }

  set(index, data) {
    // finds node at index
    const node = this.getNode(index);
    // checks if there was a node at that index
    if (!node) throw RangeError(`Index ${index} out of range`);
    // overwrites the node at the index with data from argument
    node.data = data;
  }

  insert(index, data) {
    // checks for valid index
    if (index < 0 || index > this._size) {
      throw RangeError(`Index ${index} out of range`);
    }

    // create new node with data from argument
    const newNode = this._createNode(data);

    // if the index is the head, sets new node's next as the head
    // and sets head variable to the new node, it is the new head node
    if (index === 0) {
      newNode.next = this.head;
      if (this.head) this.head.prev = newNode;
      this.head = newNode;
      if (!this.tail) this.tail = newNode; // if list was empty
    }
    // checks if index is the tail, sets new node's prev as the tail
    // and sets the tail variable to the new node, it is the new tail node
    else if (index === this._size) {
      newNode.prev = this.tail;
      if (this.tail) this.tail.next = newNode;
      this.tail = newNode;
    } else {
      // finds the node before the insertion (prev)
      const prev = this.getNode(index - 1);
      // finds the node before inserion (next)
      const next = prev.next;
      // sets the new nodes' next as the same as prev
      newNode.next = next;
      // sets prev reference for the node at index after newNode
      newNode.prev = prev;
      // changes prev node to the new node
      prev.next = newNode;
      if (next) next.prev = newNode;
    }
    // size of list goes up
    this._size++;
  }

  remove(index) {
    // checks for valid index
    if (index < 0 || index >= this._size) {
      throw RangeError(`Index ${index} out of range`);
    }

    // declare a node for removal
    let removedNode;
    // if index is the head
    if (index === 0) {
      removedNode = this.head;
      // sets the head's node .next as the new head
      // now the old head has no next,
      // it's not linked and therefore 'removed' from the list
      this.head = this.head.next;
      // the new head should no longer have a prev
      if (this.head) this.head.prev = null;
      // if the list only has one node,
      // the tail variable should also be set to null after deletion
      if (this._size === 1) this.tail = null;
    }
    // if index is the tail
    else if (index === this._size - 1) {
      removedNode = this.tail;
      // sets the tail's node .prev as the new tail
      this.tail = this.tail.prev;
      // now the old tail has no prev,
      // the new tail should no longer have a next
      this.tail.next = null;
    } else {
      // finds the node before the 'deletion'
      const prev = this.getNode(index - 1);
      // finds the node after the 'deletion'
      const next = prev.next.next;
      // sets removal node as the prev's next
      removedNode = prev.next;
      // sets the prev's next as the removed node's next
      prev.next = removedNode.next;
      // the removed node still has a next,
      // but no other node has a next that points to it
      // we can therefor consider it 'removed'

      // sets the node that is after the deletion's prev
      // to be the deleted node's prev
      next.prev = prev;
    }
    // size of list goes down
    this._size--;
  }

  removeFirst() {
    return this.remove(0);
  }

  removeLast() {
    return this.remove(this._size - 1);
  }

  // ---- NODE LOGIC ---- //

  getNode(index) {
    // returns null if index is invalid
    if (index < 0 || index >= this._size) return null;
    let current;
    let i = 0;
    let j = this._size - 1;

    // checks if it's fastest to start from head
    // otherwise starts from tail
    if (index > 0 && index < this._size / 2) {
      current = this.head;
      // loops through nodes from the head
      while (current && i < index) {
        current = current.next;
        i++;
      }
    } else {
      current = this.tail;
      // loops through nodes from the tail
      while (current && j > index) {
        current = current.prev;
        j--;
      }
    }

    return current;
  }

  //TODO: add comments
  insertAfterNode(node, data) {
    if (!node) return;

    const newNode = this._createNode(data);
    const next = node.next;

    newNode.prev = node;
    newNode.next = next;
    node.next = newNode;

    if (next) next.prev = newNode;
    else this.tail = newNode; // if inserted after tail

    this._size++;
  }

  //TODO: add comments
  insertBeforeNode(node, data) {
    if (!node) return;

    const newNode = this._createNode(data);
    const prev = node.prev;

    newNode.next = node;
    newNode.prev = prev;
    node.prev = newNode;

    if (prev) prev.next = newNode;
    else this.head = newNode; // if inserted before head

    this._size++;
  }

  getFirstNode() {
    return this.head;
  }

  getLastNode() {
    return this.getNode(this._size - 1);
  }

  getNextNode(node) {
    return node ? node.next : null;
  }

  getPreviousNode(node) {
    return node ? node.prev : null;
  }

  removeNode(targetNode) {
    // early return if there is no target node
    if (!targetNode || !this.head) return null;
    // if the target is the head
    if (targetNode === this.head) {
      // sets the head variable to the head node's next
      this.head = this.head.next;

      // sets the new head's prev to null, if it exists
      if (this.head) this.head.prev = null;

      // if the list only has one node,
      // the tail variable should also be set to null after deletion
      if (this._size === 1) this.tail = null;
    }
    // if the targetNode is the tail
    else if (targetNode === this.tail) {
      // sets the tail variable to the tail node's prev
      this.tail = this.tail.prev;

      // sets the new tail's next to null, if it exists
      if (this.tail) this.tail.next = null;
    } else {
      // finds the prev node
      const prev = this.getPreviousNode(targetNode);
      const next = prev.next.next;
      // return if there is no prev node
      if (!prev) return null;
      // sets the prev node's next to the target node's next
      prev.next = targetNode.next;
      // sets the next's prev to be prev
      next.prev = prev;
    }

    // size of list goes down
    this._size--;
    // return the node that was removed
    return targetNode.data;
  }
}
