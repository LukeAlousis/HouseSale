pragma solidity ^0.4.24;

/* @dev Import openZepplin libraries
*/
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';



/* @title House Sale Contract.
  * @dev Allows users to list houses for sale, users to put in offers on
    listed houses, sellers to accept offers, buyers to submit funds and the
    transfer of funds once the deal has been closed.
    */

contract HouseSale is Pausable {

    using SafeMath for uint;

    address seller;
    uint houseId;
    uint offerNum;
    uint housesForSale;
    uint readyToClose;


    //Struct of a house
    struct Home {
        string homeAddress;
        uint id;
        uint salePrice;
        uint offerId;
        uint depositFee;
        uint daysUntilClosing;
        uint remainingFunds;
        uint closingDate;
        uint numberOfOffers;
        uint numberOfPulledOffers;
        address buyer; //Not set until the offer is accepted
        address seller;
        State state;
        uint[] submittedOfferIds;

    }
    //Struct of an offer made on a house
    struct Offer {
        uint houseId;
        uint offerPrice;
        uint daysUntilClosingOffer;
        uint id;
        uint depositFee;
        uint closingDate;
        uint remainingFunds;
        address buyer;
        address seller;
        OfferState offerState;

    }

    //Array of all of the houses for sale
    Home[] public houses;

    //Array of all of the offers made on a house
    Offer[] public offers;

    //Mappings to keep track of the number of offers, accepted offers or houses
    //a user has
    mapping (address => uint) offersMade;
    mapping (address => uint) offersIAccepted;
    mapping (address => uint) housesByUser;
    mapping (address => uint) sentOffers;
    mapping (address => uint) offerRequiresFunding;




    //Enums that tracks the state of the transactions
    enum State {Sold, ForSale, OfferAccepted, ReadyToClose, FailedToClose, Removed}
    enum Funds {DepositMade, FundsRequired, AllFundsSubmitted}
    enum OfferState {Pending, Accepted, ReadyToClose, Pulled, FailedToClose, Complete}

    /* @dev Modifier that verifies the msg.sender is the buyer
      * @param _buyer Address of the buyer.
      */
    modifier verifyBuyer (address _buyer) {
        require (msg.sender == _buyer);
        _;

    }

    /* @dev Modifier that verifies the msg.sender is the seller
      * @param _seller Address of the seller.
      */
    modifier verifySeller (address _seller) {
        require (msg.sender == _seller);
        _;

    }

    /* @dev Add a house for sale by filling in the house struct then push the
      newHome struct into the houses array
      * @param _address House address
      * @param _price Price the seller wants to sell the house for
      */
    function addHouseForSale(string _address, uint _price) public whenNotPaused(){
        Home memory newHome = Home({
            homeAddress: _address,
            id: houseId,
            salePrice: _price,
            offerId: 0,
            depositFee: 5000 wei,
            daysUntilClosing: 0,
            remainingFunds: 0,
            closingDate: 0,
            numberOfOffers: 0,
            numberOfPulledOffers: 0,
            state: State.ForSale,
            seller: msg.sender,
            buyer: 0,
            submittedOfferIds: new uint[](0)

        });
        houseId = houseId.add(1);
        housesForSale = housesForSale.add(1);
        housesByUser[msg.sender] = housesByUser[msg.sender].add(1);
        houses.push(newHome);

    }

    /* @dev Changes the state of a house for sale to Removed if called by the
    seller. Can only happen before an offer is accepted.
      * @param _houseId Id of the house for sale
      */
    function takeDownHouse(uint _houseId) public verifySeller(houses[_houseId].seller) whenNotPaused(){
        require(houses[_houseId].state == State.ForSale);
        houses[_houseId].state = State.Removed;
        housesForSale = housesForSale.sub(1);

    }


    /* @dev Makes an offer on a house. Fill in the Offer struct then push the
      newOffer struct into the offers array
      * @param _houseId ID of the house for sale
      * @param _offer Amount the potential buyer offers for the house
      * @param _daysUntilClosing Amount of days, once the offer is accepted
      until closing
      */
    function makeOffer(uint _houseId, uint _offer, uint _daysUntilClosing) public payable whenNotPaused(){
        require(msg.sender != houses[_houseId].seller);
        require(msg.value == houses[_houseId].depositFee);
        require(houses[_houseId].state == State.ForSale);
        Offer memory newOffer = Offer({
            houseId: _houseId,
            id: offerNum,
            depositFee: houses[_houseId].depositFee,
            offerPrice: _offer,
            daysUntilClosingOffer: _daysUntilClosing,
            offerState: OfferState.Pending,
            seller: houses[_houseId].seller,
            buyer: msg.sender,
            closingDate: 0,
            remainingFunds: 0
        });

        houses[_houseId].submittedOfferIds.push(offerNum);
        offerNum = offerNum.add(1);
        houses[_houseId].numberOfOffers = houses[_houseId].numberOfOffers.add(1);

        offers.push(newOffer);
        offersMade[msg.sender] = offersMade[msg.sender].add(1);
        sentOffers[houses[_houseId].seller] = sentOffers[houses[_houseId].seller].add(1);


    }


    /* @dev Buyer who submitted an offer pulls their offer and gets their
    deposit transferred back to them if the offerState is still pending.
    Changes the offerState to pulled.
      * @param _offerId Id of the offer
      */
    function pullOffer(uint _offerId) public verifyBuyer(offers[_offerId].buyer) whenNotPaused(){
        require(offers[_offerId].offerState == OfferState.Pending);
        uint _houseId = offers[_offerId].houseId;
        houses[_houseId].numberOfPulledOffers = houses[_houseId].numberOfPulledOffers.add(1);
        offers[_offerId].offerState = OfferState.Pulled;
        offers[_offerId].buyer.transfer(offers[_offerId].depositFee);

    }

    /* @dev Seller accepts an offer made on a house. Require the house to be
    for sale and the offerState to be pending.
      * @param _houseId Id of the houe for sale
      * @param _offerId Id of the offer the seller wants to accept
      */
    function acceptOffer(uint _houseId, uint _offerId) public verifySeller(houses[_houseId].seller) whenNotPaused(){
        require(houses[_houseId].state == State.ForSale);
        //require(offers[_offerId].buyer != 0x0000000000000000000000000000000000000000); //Stops seller from accepting if offer has been pulled
        require(offers[_offerId].offerState == OfferState.Pending);
        houses[_houseId].salePrice = offers[_offerId].offerPrice;
        houses[_houseId].daysUntilClosing = offers[_offerId].daysUntilClosingOffer;
        houses[_houseId].state = State.OfferAccepted;
        houses[_houseId].buyer = offers[_offerId].buyer;
        houses[_houseId].offerId = offers[_offerId].id;
        houses[_houseId].remainingFunds = houses[_houseId].salePrice.sub(houses[_houseId].depositFee);
        //houses[_houseId].closingDate = now + houses[_houseId].daysUntilClosing * 1 seconds;
        houses[_houseId].closingDate = now.add(houses[_houseId].daysUntilClosing.mul(86400 seconds));
        //acceptedOffers[houses[_houseId].buyer]++;
        offersIAccepted[houses[_houseId].seller] = offersIAccepted[houses[_houseId].seller].add(1);
        offerRequiresFunding[houses[_houseId].buyer] = offerRequiresFunding[houses[_houseId].buyer].add(1);
        sentOffers[houses[_houseId].seller] = sentOffers[houses[_houseId].seller].sub(1);
        offers[_offerId].closingDate = houses[_houseId].closingDate;
        offers[_offerId].remainingFunds = houses[_houseId].remainingFunds;
        offers[_offerId].offerState = OfferState.Accepted;
        housesForSale = housesForSale.sub(1);

    }

    /* @dev Buyer submits remaining funds after an offer has been accepted,
    before the closing date. If past closing date then fail. Only the buyer Can
    submit remaining funds
      * @param _houseId Id of the house
      * @value remaining funds in ether
      */
    function submitRemainingFunds(uint _houseId) public payable verifyBuyer(houses[_houseId].buyer) whenNotPaused(){
        if (now >= houses[_houseId].closingDate) {
            offerRequiresFunding[houses[_houseId].buyer] = offerRequiresFunding[houses[_houseId].buyer].sub(1);
            transferDepositToSeller(_houseId);
            msg.sender.transfer(msg.value);
        } else {
            require(msg.value == houses[_houseId].remainingFunds);
            require(houses[_houseId].state == State.OfferAccepted);
            offerRequiresFunding[houses[_houseId].buyer] = offerRequiresFunding[houses[_houseId].buyer].sub(1);
            houses[_houseId].state = State.ReadyToClose;
            readyToClose = readyToClose.add(1);
            offers[houses[_houseId].offerId].offerState = OfferState.ReadyToClose;

        }

    }


    /* @dev Private function that transfers the deposit to the seller if the
    buyer has not submitted all remaining funds to the contract
      * @param _houseId Id of the house
      */
    function transferDepositToSeller(uint _houseId) private whenNotPaused(){
        houses[_houseId].state = State.FailedToClose;
        offers[houses[_houseId].offerId].offerState = OfferState.FailedToClose;
        houses[_houseId].seller.transfer(houses[_houseId].depositFee);
    }

    /* @dev Closes the deal if past the closing date. If all funds have been
    submitted then the funds will be transfered to the seller. If not only the
    deposit will be sent to the seller.
      * @param _houseId Id of the house
      */
    function closeDeal(uint _houseId) public whenNotPaused(){
        require(now >= houses[_houseId].closingDate);
        if (houses[_houseId].state != State.ReadyToClose) {
            transferDepositToSeller(_houseId);

        } else {
            houses[_houseId].state = State.Sold;
            offers[houses[_houseId].offerId].offerState = OfferState.Complete;
            readyToClose = readyToClose.sub(1);
            houses[_houseId].seller.transfer(houses[_houseId].salePrice);

        }

    }



    /*The following functions are view functions used to get information
    for the web application*/


    /* @dev Gets a list of houses that are for sale
      * @return uint[] Array of houses that are for sale
      */
    function getHousesForSale() external view returns(uint[]) {
        uint[] memory result = new uint[](housesForSale);

        uint counter = 0;
        for (uint i = 0; i < houseId; i++) {
            //Checks to see if house has not been taken down
            if (houses[i].state == State.ForSale) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /* @dev Gets all offer Ids on a house.
      * @param _houseId Id of the house
      * @return uint[] array of offers on the house
      */
    function getOfferIds(uint _houseId) external view verifySeller(houses[_houseId].seller) returns(uint[]) {
        return houses[_houseId].submittedOfferIds;
    }

     /* @dev Gets the offer infromation from the offerId
       * @param _offerId Id of the offer
       * @return houseId The Id of the house
       * @return daysUntilClosingOffer The days until the offer can be closed
       * @return id Id f the offer
       * @return depositFee Fee required to make the offer
       * @return buyer Address of the buyer
       * @return seller Address of the seller
       * @return offerState State of the offer
       */
    function getOffer(uint _offerId) external view returns(uint, uint, uint, uint, address, address, OfferState) {
        return (
            offers[_offerId].houseId,
            offers[_offerId].daysUntilClosingOffer,
            offers[_offerId].id,
            offers[_offerId].offerPrice,
            offers[_offerId].buyer,
            offers[_offerId].seller,
            offers[_offerId].offerState
        );


    }


    /* @dev Gets a list of the msg.senders accepted offers by Id after
    an offer has been accepted.
      * @return uint[] Array of accepted offers
      */
    function getMyAcceptedOffersId() external view returns(uint[]) {
        uint[] memory result = new uint[](offerRequiresFunding[msg.sender]);

        uint counter = 0;
        for (uint i = 0; i < offerNum; i++) {
            //Checks to see if house has not been taken down
            if (
              offers[i].buyer == msg.sender
              && offers[i].offerState == OfferState.Accepted
              && houses[offers[i].houseId].state == State.OfferAccepted

            ) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /* @dev Gets a list of the msg.senders offers by Id
    that they accepted
      * @return uint[] Array of offers the seller has accepted
      */
    function getOffersIAcceptedId() external view returns(uint[]) {
        uint[] memory result = new uint[](offersIAccepted[msg.sender]);

        uint counter = 0;
        for (uint i = 0; i < offerNum; i++) {
            //Checks to see if house has not been taken down
            if (
              offers[i].seller == msg.sender
              && offers[i].offerState == OfferState.Accepted
              && houses[offers[i].houseId].state == State.OfferAccepted

            ) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /* @dev Gets a list of the msg.senders offers by Id
      * @return uint[] Array of offers by the msg.sender
      */
    function getMyOffersId() external view returns(uint[]) {
        uint[] memory result = new uint[](offersMade[msg.sender]);

        uint counter = 0;
        for (uint i = 0; i < offerNum; i++) {
            //Checks to see if house has not been taken down
            if (offers[i].buyer == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /* @dev Gets a list of the msg.senders houses for sale by Id
      * @return uint[] Array of house Ids that are owned by the seller
      */
    function getMyHousesId() external view returns(uint[]) {
        uint[] memory result = new uint[](housesByUser[msg.sender]);

        uint counter = 0;
        for (uint i = 0; i < houseId; i++) {
            //Checks to see if house has not been taken down
            if (houses[i].seller == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /* @dev Gets a list of the msg.senders houses that are ready to close
      * @return uint[] Array of house Ids that have state ready to close
      */
    function getReadyToCloseId() external view returns(uint[]) {
        uint[] memory result = new uint[](readyToClose);

        uint counter = 0;
        for (uint i = 0; i < houseId; i++) {
            //Checks to see if house has not been taken down
            if (houses[i].state == State.ReadyToClose) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
    /* @dev Gets a list of pending offers on the msg.senders houses
      * @return uint[] Array of pending offers
      */
    function getOffersIdsOnMyHouses() external view returns(uint[]) {
        uint[] memory result = new uint[](sentOffers[msg.sender]);

        uint counter = 0;
        for (uint i = 0; i < offerNum; i++) {
            //Checks to see if house has not been taken down
            if (
              offers[i].seller == msg.sender
              && offers[i].offerState == OfferState.Pending
            ) {
                result[counter] = i;
                counter++;
            }
        }
        return result;

    }



}
