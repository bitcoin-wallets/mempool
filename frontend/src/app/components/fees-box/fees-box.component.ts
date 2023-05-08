import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StateService } from '../../services/state.service';
import { Observable } from 'rxjs';
import { Recommendedfees } from '../../interfaces/websocket.interface';
import { feeLevels, mempoolFeeColors } from '../../app.constants';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-fees-box',
  templateUrl: './fees-box.component.html',
  styleUrls: ['./fees-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeesBoxComponent implements OnInit {
  isLoadingWebSocket$: Observable<boolean>;
  recommendedFees$: Observable<Recommendedfees>;
  gradient = 'linear-gradient(to right, #2e324e, #2e324e)';
  noPriority = '#2e324e';

  constructor(
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.isLoadingWebSocket$ = this.stateService.isLoadingWebSocket$;
    this.recommendedFees$ = this.stateService.recommendedFees$
      .pipe(
        tap((fees) => {
          let feeLevelIndex = feeLevels.slice().reverse().findIndex((feeLvl) => fees.economyFee >= feeLvl);
          feeLevelIndex = feeLevelIndex >= 0 ? feeLevels.length - feeLevelIndex : feeLevelIndex;
          const startColor = '#' + (mempoolFeeColors[feeLevelIndex - 1] || mempoolFeeColors[mempoolFeeColors.length - 1]);

          feeLevelIndex = feeLevels.slice().reverse().findIndex((feeLvl) => fees.hourFee >= feeLvl);
          feeLevelIndex = feeLevelIndex >= 0 ? feeLevels.length - feeLevelIndex : feeLevelIndex;
          const lowColor = '#' + (mempoolFeeColors[feeLevelIndex - 1] || mempoolFeeColors[mempoolFeeColors.length - 1]);

          feeLevelIndex = feeLevels.slice().reverse().findIndex((feeLvl) => fees.halfHourFee >= feeLvl);
          feeLevelIndex = feeLevelIndex >= 0 ? feeLevels.length - feeLevelIndex : feeLevelIndex;
          const medColor = '#' + (mempoolFeeColors[feeLevelIndex - 1] || mempoolFeeColors[mempoolFeeColors.length - 1]);

          feeLevelIndex = feeLevels.slice().reverse().findIndex((feeLvl) => fees.fastestFee >= feeLvl);
          feeLevelIndex = feeLevelIndex >= 0 ? feeLevels.length - feeLevelIndex : feeLevelIndex;
          const highColor = '#' + (mempoolFeeColors[feeLevelIndex - 1] || mempoolFeeColors[mempoolFeeColors.length - 1]);

          this.gradient = `linear-gradient(to right, ${lowColor} 0%, ${medColor} 50%, ${highColor} 100%)`;
          this.noPriority = startColor;
        }
      )
    );
  }
}
