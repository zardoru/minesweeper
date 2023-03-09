import { Cell } from './cell';

describe('Cell', () => {
  it('should create an instance', () => {
    expect(new Cell(0, 0)).toBeTruthy();
  });

  it ('should be a bomb if content is -1', () => {
    let c = new Cell(0, 0);
    c.content = -1;
    expect(c.isBomb()).toBeTrue()
    expect(c.isEmpty()).toBeFalse()
    expect(c.isNumberCell()).toBeFalse()
  })

  it ('should be empty if content is 0', () => {
    let c = new Cell(0, 0);
    c.content = 0;
    expect(c.isBomb()).toBeFalse()
    expect(c.isEmpty()).toBeTrue()
    expect(c.isNumberCell()).toBeFalse()
  })

  it ('should be a number cell if content is > 0', () => {
    let c = new Cell(0, 0);
    c.content = 5;
    expect(c.isBomb()).toBeFalse()
    expect(c.isEmpty()).toBeFalse()
    expect(c.isNumberCell()).toBeTrue()
  })

  it ('should explode if it is a bomb', () => {
    let c = new Cell(0, 0);
    c.content = -1;
    expect(c.activate()).toBeTrue()
    expect(c.isRevealed).toBeTruthy()
  });

  it ('should not explode if it is not a bomb', () => {
    let c = new Cell(0, 0);
    c.content = 0;
    expect(c.activate()).toBeFalse()
    c.content = 1;
    expect(c.activate()).toBeFalse()
    expect(c.isRevealed()).toBeTruthy()
  });

  it ('should toggle flag states', () => {
    let c = new Cell(0, 0);
    expect(c.flag()).toBe(1);
    expect(c.flag()).toBe(-1);
  });
});
