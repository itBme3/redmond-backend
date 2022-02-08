import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CardStyle, CARD_STYLES } from 'projects/redmond-fire-library/src/lib/@site-library/site-shared/card/card.component';
import { BlockType, BLOCK_TYPES, defaultContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';

@Component({
  selector: 'app-add-grid-block',
  templateUrl: './add-grid-block.component.html',
  styleUrls: ['./add-grid-block.component.scss']
})
export class AddGridBlockComponent implements OnInit {

  BlockType = BlockType
  blockType: BlockType = null;
  blockTypes: BlockType[] = BLOCK_TYPES;
  collectionType: 'manual' | 'query' = null;
  collectionTypes = ['manual', 'query'];
  cardStyle: CardStyle = null;
  cardStyles: CardStyle[] = CARD_STYLES.filter(s => s !== CardStyle.STANDARD);
  hasSecondParam = [BlockType.CARD];

  constructor(public dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    
  }

  createBlock() {
    setTimeout$(() => {
      const newBlock = defaultContentBlock(this.blockType, this.blockType === BlockType.CARD ? CardStyle.OVERLAY : this.blockType === BlockType.COLLECTION ? 'manual' : null)
      this.dialogRef.close(newBlock)
    }, 0)
  }

}
