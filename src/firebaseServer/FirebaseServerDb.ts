import FirebaseDb from "../api/firebase/FirebaseDb";

import * as DbSchema from "../db/schema";

import {
  Location,
  PromoCodePackage,
  PurchasedBevegram,
  PurchasedBevegramSummary,
  ReceivedBevegram,
  ReceivedBevegramSummary,
  SentBevegram,
  SentBevegramSummary,
  UserRedeemedBevegram,
  Vendor,
  VendorRedeemedBevegram,
} from "../db/tables";

/* tslint:disable:member-ordering */
class FirebaseServerDb extends FirebaseDb {
  constructor(db) {
    super(db);
  }

  public async deleteNode(url: string) {
    return await this.db.ref(url).remove();
  }

  //  Purchase List -------------------------------------------------------{{{

  public async addPurchasedBevegramToUser(
    userFirebaseId: string,
    purchasedBevegram: PurchasedBevegram,
  ): Promise<string> {
    const id = await this.pushNode(
      DbSchema.GetPurchasedBevegramListDbUrl(userFirebaseId),
      purchasedBevegram,
    );
    await this.incrementPurchaseSummary(userFirebaseId, purchasedBevegram);
    await this.incrementSentSummaryWithPurchasedBevegram(
      userFirebaseId,
      purchasedBevegram,
    );
    return id;
  }

  public async updatePurchasedBevegramWithSendId(
    firebaseId: string,
    purchaseId: string,
    sentBevegramId: string,
  ): Promise<void> {
    const url: string =
      DbSchema.GetPurchasedBevegramListDbUrl(firebaseId) + `/${purchaseId}`;
    await this.updateNode(
      url,
      (purchasedBevegram: PurchasedBevegram): PurchasedBevegram => {
        return {
          ...purchasedBevegram,
          sentBevegramId,
        };
      },
    );
  }

  //  End Purchase List ---------------------------------------------------}}}
  //  Purchase Summary ----------------------------------------------------{{{

  private async incrementPurchaseSummary(
    userFirebaseId: string,
    purchasedBevegram: PurchasedBevegram,
  ): Promise<void> {
    const url = DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId);
    await this.updateNode(
      url,
      (summary: PurchasedBevegramSummary): PurchasedBevegramSummary => {
        return {
          ...summary,
          availableToSend: FirebaseDb.SafeAdd(
            summary.availableToSend,
            purchasedBevegram.quantity,
          ),
          quantityPurchased: FirebaseDb.SafeAdd(
            summary.quantityPurchased,
            purchasedBevegram.quantity,
          ),
          sent: FirebaseDb.SafeAdd(summary.sent, 0),
        };
      },
    );
  }

  private async decrementPurchaseSummary(
    userFirebaseId: string,
    sentBevegram: SentBevegram,
  ): Promise<void> {
    await this.updateNode(
      DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId),
      summary => {
        return {
          ...summary,
          availableToSend: FirebaseDb.SafeSubtract(
            summary.availableToSend,
            sentBevegram.quantity,
          ),
          quantityPurchased: FirebaseDb.SafeAdd(summary.quantityPurchased, 0),
          sent: FirebaseDb.SafeAdd(summary.sent, sentBevegram.quantity),
        };
      },
    );
  }

  //  End Purchase Summary ------------------------------------------------}}}
  //  Promo Code ----------------------------------------------------------{{{

  public async addPromoCode(
    promoCode: string,
    promoCodePackage: PromoCodePackage,
  ): Promise<void> {
    await this.incrementPromoCodeSummary(promoCode, promoCodePackage);
    await this.pushNode(
      DbSchema.GetPromoCodeListDbUrl(promoCode),
      promoCodePackage,
    );
  }

  private async incrementPromoCodeSummary(
    promoCode: string,
    promoCodePack: PromoCodePackage,
  ): Promise<void> {
    await this.updateNode(
      DbSchema.GetPromoCodeSummaryDbUrl(promoCode),
      summary => {
        return {
          total: FirebaseDb.SafeAdd(promoCodePack.quantity, summary.total),
        };
      },
    );
  }

  //  End Promo Code ------------------------------------------------------}}}
  //  Sent List -----------------------------------------------------------{{{

  public async addSentBevegramToUser(
    userFirebaseId: string,
    sentBevegram: SentBevegram,
  ): Promise<string> {
    const id = await this.pushNode(
      DbSchema.GetSentBevegramListDbUrl(userFirebaseId),
      sentBevegram,
    );

    // Since we are sending we decrement the purchase and sent summary
    await this.decrementPurchaseSummary(userFirebaseId, sentBevegram);
    await this.decrementSentSummaryWithSentBevegram(
      userFirebaseId,
      sentBevegram,
    );

    return id;
  }

  //  End Sent List -------------------------------------------------------}}}
  //  Sent Summary --------------------------------------------------------{{{

  private async incrementSentSummaryWithPurchasedBevegram(
    userFirebaseId: string,
    purchasedBevegram: PurchasedBevegram,
  ): Promise<void> {
    const url = DbSchema.GetSentBevegramSummaryDbUrl(userFirebaseId);
    await this.updateNode(
      url,
      (summary: SentBevegramSummary): SentBevegramSummary => {
        return {
          ...summary,
          availableToSend: FirebaseDb.SafeAdd(summary.availableToSend, 0),
          sent: FirebaseDb.SafeAdd(summary.sent, purchasedBevegram.quantity),
        };
      },
    );
  }

  private async decrementSentSummaryWithSentBevegram(
    userFirebaseId: string,
    sentBevegram: SentBevegram,
  ): Promise<void> {
    const url = DbSchema.GetSentBevegramSummaryDbUrl(userFirebaseId);
    this.updateNode(
      url,
      (summary: SentBevegramSummary): SentBevegramSummary => {
        return {
          availableToSend: FirebaseDb.SafeSubtract(
            summary.availableToSend,
            sentBevegram.quantity,
          ),
          sent: FirebaseDb.SafeAdd(summary.sent, sentBevegram.quantity),
        };
      },
    );
  }

  //  End Sent Summary ----------------------------------------------------}}}
  //  Received List -------------------------------------------------------{{{

  public async addReceivedBevegramToReceiverBevegrams(
    receiverFirebaseId: string,
    receivedBevegram: ReceivedBevegram,
  ): Promise<string> {
    const id = await this.pushNode(
      DbSchema.GetReceivedBevegramListDbUrl(receiverFirebaseId),
      receivedBevegram,
    );

    await this.incrementReceivedSummaryWithReceivedBevegram(
      receiverFirebaseId,
      receivedBevegram,
    );

    return id;
  }

  private async updateReceivedBevegramAsRedeemed(
    userFirebaseId: string,
    receivedBevegramId: string,
  ): Promise<void> {
    const url =
      DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId) +
      `/${receivedBevegramId}`;
    await this.updateNode(url, receivedBevegram => {
      return {
        ...receivedBevegram,
        isRedeemed: true,
      };
    });
  }

  //  End Received List ---------------------------------------------------}}}
  //  Received Summary ----------------------------------------------------{{{

  private async incrementReceivedSummaryWithReceivedBevegram(
    receiverFirebaseId: string,
    receivedBevegram: ReceivedBevegram,
  ): Promise<void> {
    await this.updateNode(
      DbSchema.GetReceivedBevegramSummaryDbUrl(receiverFirebaseId),
      summary => {
        return {
          ...summary,
          availableToRedeem: FirebaseDb.SafeAdd(
            summary.availableToRedeem,
            receivedBevegram.quantity,
          ),
          redeemed: FirebaseDb.SafeAdd(summary.redeemed, 0),
          total: FirebaseDb.SafeAdd(summary.total, receivedBevegram.quantity),
        };
      },
    );
  }

  //  End Received Summary ------------------------------------------------}}}
  //  User Redeem List ----------------------------------------------------{{{

  public async redeemUserBevegram(
    userFirebaseId: string,
    userRedeemedBevegram: UserRedeemedBevegram,
    receivedId: string,
    updatedReceivedBevegram: ReceivedBevegram,
  ): Promise<void> {
    const redeemedListUrl = DbSchema.GetRedeemedBevegramListDbUrl(
      userFirebaseId,
    );
    const receivedNodeUrl =
      DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId) + `/${receivedId}`;
    const redeemedSummaryUrl = DbSchema.GetRedeemedBevegramSummaryDbUrl(
      userFirebaseId,
    );
    const receivedSummaryUrl = DbSchema.GetReceivedBevegramSummaryDbUrl(
      userFirebaseId,
    );
    const quantity = userRedeemedBevegram.quantity;
    const vendorId = userRedeemedBevegram.vendorId;

    const userRedeemId = await this.pushNode(
      redeemedListUrl,
      userRedeemedBevegram,
    );
    await this.writeNode(receivedNodeUrl, updatedReceivedBevegram);

    await this.updateReceivedBevegramAsRedeemed(userFirebaseId, receivedId);

    // update redeemed summary
    await this.updateNode(redeemedSummaryUrl, summary => {
      const vendorToAdd = {};
      vendorToAdd[vendorId] = vendorId;
      return {
        ...summary,
        total: FirebaseDb.SafeAdd(quantity, summary.total),
        vendorList: { ...summary.vendorList, ...vendorToAdd },
      };
    });

    // update receivedSummary
    await this.updateNode(receivedSummaryUrl, summary => {
      return {
        ...summary,
        availableToRedeem: FirebaseDb.SafeSubtract(
          summary.availableToRedeem,
          quantity,
        ),
        redeemed: FirebaseDb.SafeAdd(summary.redeemed, quantity),
      };
    });
  }

  public async redeemVendorBevegram(
    vendorId: string,
    vendorRedeemedBevegram: VendorRedeemedBevegram,
  ): Promise<void> {
    const vendorRedeemListUrl = DbSchema.GetVendorRedeemListDbUrl(vendorId);
    this.pushNode(vendorRedeemListUrl, vendorRedeemedBevegram);

    // TODO: Decide on a structure for the vendor summary
  }

  //  End User Redeem List ------------------------------------------------}}}
}

export default FirebaseServerDb;
