import { Grid } from './grid';

describe('Grid', () => {
  it('should create an instance', () => {
    expect(new Grid(2, 2)).toBeTruthy();
  });

  it('should be the right dimensions', () => {
    expect(new Grid(10, 15).cells().length).toBe(150);
  })

  it('should have the mine count we ask it to have', () => {
    const g = new Grid(10, 15);
    for(let i = 0; i < 1000; i++) {
      let expectedMineCount = Math.floor(Math.random() * 20) + 1;
      g.generateBoard(expectedMineCount);

      let mineCount = 0;
      for (let row = 0; row < 10; row++) {
        for (let col= 0; col < 15; col++) {
          if (g.getCell(row, col).isBomb())
            mineCount++
        }
      }

      expect(mineCount).toBe(expectedMineCount);
    }
  });

  it('should never place a mine on the coordinates we ask it to', () => {
    const g = new Grid(10, 15);

    for (let i = 0; i < 1000; i++) {
      let rx = Math.floor(Math.random() * 10);
      let ry = Math.floor(Math.random() * 15);

      g.generateBoard(20, rx, ry);
      expect(g.getCell(rx, ry).isBomb()).toBeFalse();
    }
  });

  it('should reveal tiles only up to the first layer of numbers', () => {
    const g = new Grid(9, 9);
    /*
    * .B.....B.
    * B4BBBBBBB
    * .B43335B.
    * .B3...3B.
    * .B3.C.3B.
    * .B3...3B.
    * .B53335B.
    * BBBBBBBBB
    * .B.....B.
    *
    * click at C, reveal the center tiles.
    * */

    g.reset();

    for (let row = 0; row < 9; row++) {
      for(let col = 0; col < 9; col++) {
        if (row == 1 || row == 7 || col == 1 || col == 7) {
          g.getCell(row, col).content = -1;
        }
      }
    }

    g.getCell(1, 1).content = 0;
    g.calculateCellAdjacencies();
    g.revealEmpty(4, 4);

    let revealedTotal = 0;
    let unrevealedTotal = 0;
    for (let row = 0; row < 9; row++) {
      for(let col = 0; col < 9; col++) {
        if (g.getCell(row, col).isRevealed())
          revealedTotal++;
        else
          unrevealedTotal++;
      }
    }

    // console.log(revealedTotal, unrevealedTotal);
    expect(revealedTotal).toBe(25);
    expect(unrevealedTotal).toBe(9 * 9 - 25);
  });
});
