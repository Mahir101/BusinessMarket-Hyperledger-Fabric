package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

type Track struct {
	Userid  string `json:"Userid"`
	Orderid string `json:"Orderid"`
	State   string `json:"State"`
	Doctype string `json:"Doctype"`
}

type Order struct {
	Userid   string
	ItemName string
	ItemQty  string
	Total    string
	Address  string
	Name     string
	Delivery string
	State    string
	Date     string
	Doctype  string
}

type Product struct {
	Manid       string
	Imagepath   string
	Imagepath2  string
	Imagepath3  string
	Title       string
	Description string
	Price       int
	Avail       string
	Category    string
	Featured    string
	Verified    string
	Date        string
	Doctype     string
}

type User struct {
	Name     string
	Email    string
	Password string
	Image    string
	Age      string
	City     string
	Country  string
	Gender   string
	Phone    string
	Doctype  string
}

type Manufacturer struct {
	Name     string
	Email    string
	Password string
	Phone    string
	Address  string
	Doctype  string
}

type Discussion struct {
	Proid      string
	Userid     string
	Discussion string
	Date       string
	Doctype    string
}

type Queries struct {
	Email    string
	Qmessage string
	Date     string
	Doctype  string
}

type Contact struct {
	Name    string
	Email   string
	Message string
	Date    string
	Doctype string
}

// ===========================================================================================
// constructQueryResponseFromIterator constructs a JSON array containing query results from
// a given result iterator
// ===========================================================================================
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(",\"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}

// =========================================================================================
// getQueryResultForQueryString executes the passed in query string.
// Result set is built and returned as a byte array containing the JSON results.
// =========================================================================================
func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	//doing nothing here
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "querySingleTrack" {
		return s.querySingleTrack(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createTrack" { //my createTrack
		return s.createTrack(APIstub, args)
	} else if function == "queryAllTrack" { //my queryTrackByUser
		return s.queryAllTrack(APIstub)
	} else if function == "changeTrackState" {
		return s.changeTrackState(APIstub, args)
	} else if function == "changeUserState" {
		return s.changeUserState(APIstub, args)
	} else if function == "changeProductState" {
		return s.changeProductState(APIstub, args)
	} else if function == "getHistoryForTrack" {
		return s.getHistoryForTrack(APIstub, args)
	} else if function == "querySingleOrder" {
		return s.querySingleOrder(APIstub, args)
	} else if function == "querySingleOrderID" {
		return s.querySingleOrderID(APIstub, args)
	} else if function == "querySingleProduct" {
		return s.querySingleProduct(APIstub, args)
	} else if function == "querySingleProductID" {
		return s.querySingleProductID(APIstub, args)
	} else if function == "querySingleUser" {
		return s.querySingleUser(APIstub, args)
	} else if function == "querySingleManufacturer" {
		return s.querySingleManufacturer(APIstub, args)
	} else if function == "querySingleDiscussion" {
		return s.querySingleDiscussion(APIstub, args)
	} else if function == "createOrder" {
		return s.createOrder(APIstub, args)
	} else if function == "createProduct" {
		return s.createProduct(APIstub, args)
	} else if function == "createQueries" {
		return s.createQueries(APIstub, args)
	} else if function == "createContact" {
		return s.createContact(APIstub, args)
	} else if function == "createUser" {
		return s.createUser(APIstub, args)
	} else if function == "createDiscussion" {
		return s.createDiscussion(APIstub, args)
	} else if function == "createManufacturer" {
		return s.createManufacturer(APIstub, args)
	} else if function == "queryAllProduct" {
		return s.queryAllProduct(APIstub)
	} else if function == "queryAllQueries" {
		return s.queryAllQueries(APIstub)
	} else if function == "queryAllContact" {
		return s.queryAllContact(APIstub)
	} else if function == "queryProductCategory" {
		return s.queryProductCategory(APIstub, args)
	} else if function == "queryProductRange" {
		return s.queryProductRange(APIstub, args)
	} else if function == "queryProductSearch" {
		return s.queryProductSearch(APIstub, args)
	} else if function == "delete" {
		return s.delete(APIstub, args)
	} else if function == "queryProductAdmin" {
		return s.queryProductAdmin(APIstub)
	} else if function == "queryAllOrder" {
		return s.queryAllOrder(APIstub)
	} else if function == "changeProductAdmin" {
		return s.changeProductAdmin(APIstub, args)
	} else if function == "changeOrderState" {
		return s.changeOrderState(APIstub, args)
	}
	return shim.Error("Invalid Smart Contract function name. WHY??")
}

func (s *SmartContract) querySingleTrack(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	trackAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(trackAsBytes)
}

//////////////////////////////////////
func (s *SmartContract) querySingleOrder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"orders\",\"Userid\":\"%v\"}}", args[0])
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) querySingleOrderID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"orders\",\"_id\":\"%v\"}}", args[0])
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) queryAllOrder(APIstub shim.ChaincodeStubInterface) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"orders\"}}")
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) querySingleProduct(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	///fmt.Sprintf("{\"selector\":{\"Colour\":\"%v\"}}", args[0])
	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"products\", \"Manid\": \"%v\"}}", args[0])
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) querySingleProductID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	///fmt.Sprintf("{\"selector\":{\"Colour\":\"%v\"}}", args[0])
	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"products\", \"_id\": \"%v\"}}", args[0])
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) queryProductCategory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"products\",\"Verified\":\"YES\", \"Category\": \"%v\"}}", args[0])
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}
func (s *SmartContract) queryProductRange(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	vx, err1 := strconv.Atoi(args[0])
	vy, err2 := strconv.Atoi(args[1])
	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"products\",\"Verified\":\"YES\", \"Price\": {\"$gte\": %d ,\"$lte\": %d} }}", vx, vy)
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err1 != nil {
		fmt.Println("the vx should be an integer")
	}
	if err2 != nil {
		fmt.Println("the vy should be an integer")
	}
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) queryProductSearch(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"products\",\"Verified\":\"YES\", \"Title\":{ \"$regex\": \"%v\" } }}", args[0])
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) querySingleManufacturer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	///fmt.Sprintf("{\"selector\":{\"Colour\":\"%v\"}}", args[0])
	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"manufact\",\"Email\":\"%v\"}}", args[0])

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

func (s *SmartContract) querySingleUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"users\",\"Email\":\"%v\"}}", args[0])

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)

}

func (s *SmartContract) querySingleDiscussion(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Doctype\":\"discussions\",\"proid\":\"%v\"}}", args[0])

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)

}

////////////////////////////////

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) createTrack(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var trackKey string = args[0]
	var uid string = args[1]
	var oid string = args[2]
	var state string = args[3]
	var doc string = "tracking"

	var track = Track{Userid: uid, Orderid: oid, State: state, Doctype: doc}

	trackAsBytes, _ := json.Marshal(track)
	APIstub.PutState(trackKey, trackAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) createQueries(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var queriesKey string = args[0]
	var email string = args[1]
	var msg string = args[2]
	var date string = time.Now().String()
	var doc string = "queries"

	var queries = Queries{Email: email, Qmessage: msg, Date: date, Doctype: doc}

	queriesAsBytes, _ := json.Marshal(queries)
	APIstub.PutState(queriesKey, queriesAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) createContact(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var contactKey string = args[0]
	var name string = args[1]
	var email string = args[2]
	var msg string = args[3]
	var date string = time.Now().String()
	var doc string = "contacts"

	var contact = Contact{Name: name, Email: email, Message: msg, Date: date, Doctype: doc}

	contactAsBytes, _ := json.Marshal(contact)
	APIstub.PutState(contactKey, contactAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) createOrder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var orderKey string = args[0]
	var uid string = args[1]
	var itemName string = args[2]
	var itemQty string = args[3]
	var total string = args[4]
	var address string = args[5]
	var name string = args[6]
	var delivery string = args[7]
	var st string = args[8]

	var date string = time.Now().String()
	var doc string = "orders"

	var order = Order{Userid: uid, ItemName: itemName, ItemQty: itemQty, Total: total, Address: address, Name: name, Delivery: delivery, State: st, Date: date, Doctype: doc}

	orderAsBytes, _ := json.Marshal(order)
	APIstub.PutState(orderKey, orderAsBytes)

	return shim.Success(nil)

}

func (s *SmartContract) createProduct(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var productKey string = args[0]
	var manu string = args[1]
	var img1 string = args[2]
	var img2 string = args[3]
	var img3 string = args[4]
	var title string = args[5]
	var desc string = args[6]

	var price, errx = strconv.Atoi(args[7])
	if errx != nil {
		fmt.Println("the price should be an integer")
	}
	var avail string = args[8]
	var cat string = args[9]
	var feat string = args[10]
	var xx string = "NO"

	var date string = time.Now().String()
	var doc string = "products"

	var product = Product{Manid: manu, Imagepath: img1, Imagepath2: img2, Imagepath3: img3, Title: title, Description: desc, Price: price, Avail: avail, Category: cat, Featured: feat, Verified: xx, Date: date, Doctype: doc}

	productAsBytes, _ := json.Marshal(product)
	APIstub.PutState(productKey, productAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) createUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var userKey string = args[0]
	var name string = args[1]
	var email string = args[2]
	var password string = args[3]
	var image string = args[4]
	var age string = args[5]
	var city string = args[6]
	var country string = args[7]
	var gender string = args[8]
	var phone string = args[9]
	var doc string = "users"

	var user = User{Name: name, Email: email, Password: password, Image: image, Age: age, City: city, Country: country, Gender: gender, Phone: phone, Doctype: doc}

	userAsBytes, _ := json.Marshal(user)
	APIstub.PutState(userKey, userAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) createManufacturer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var manufacturerKey string = args[0]
	var name string = args[1]
	var email string = args[2]
	var pass string = args[3]
	var phone string = args[4]
	var add string = args[5]
	var doc string = "manufact"

	var manufacturer = Manufacturer{Name: name, Email: email, Password: pass, Phone: phone, Address: add, Doctype: doc}

	manufacturerAsBytes, _ := json.Marshal(manufacturer)
	APIstub.PutState(manufacturerKey, manufacturerAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) createDiscussion(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var discussionKey string = args[0]
	var pid string = args[1]
	var uid string = args[2]
	var dis string = args[3]
	var date string = time.Now().String()
	var doc string = "dicussions"

	var discussion = Discussion{Proid: pid, Userid: uid, Discussion: dis, Date: date, Doctype: doc}

	discussionAsBytes, _ := json.Marshal(discussion)
	APIstub.PutState(discussionKey, discussionAsBytes)

	return shim.Success(nil)
}

//////////////////////////////////

func (s *SmartContract) queryAllTrack(APIstub shim.ChaincodeStubInterface) sc.Response {
	queryString := "{\"selector\":{\"Doctype\":\"tracking\"}}"

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (s *SmartContract) queryAllProduct(APIstub shim.ChaincodeStubInterface) sc.Response {
	queryString := "{\"selector\":{\"Doctype\":\"products\",\"Verified\":\"YES\"}}"

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (s *SmartContract) queryProductAdmin(APIstub shim.ChaincodeStubInterface) sc.Response {
	queryString := "{\"selector\":{\"Doctype\":\"products\"}}"

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (s *SmartContract) queryAllQueries(APIstub shim.ChaincodeStubInterface) sc.Response {
	queryString := "{\"selector\":{\"Doctype\":\"queries\"}}"

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}
func (s *SmartContract) queryAllContact(APIstub shim.ChaincodeStubInterface) sc.Response {
	queryString := "{\"selector\":{\"Doctype\":\"contacts\"}}"

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (s *SmartContract) changeTrackState(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	trackAsBytes, _ := APIstub.GetState(args[0])
	track := Track{}

	json.Unmarshal(trackAsBytes, &track)
	track.State = args[1]

	trackAsBytes, _ = json.Marshal(track)
	APIstub.PutState(args[0], trackAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) changeOrderState(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	orderAsBytes, _ := APIstub.GetState(args[0])
	order := Order{}

	json.Unmarshal(orderAsBytes, &order)
	order.State = args[1]

	orderAsBytes, _ = json.Marshal(order)
	APIstub.PutState(args[0], orderAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) changeProductState(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	productAsBytes, _ := APIstub.GetState(args[0])
	product := Product{}

	json.Unmarshal(productAsBytes, &product)
	product.Manid = args[1]
	product.Imagepath = args[2]
	product.Imagepath2 = args[3]
	product.Imagepath3 = args[4]
	product.Title = args[5]
	product.Description = args[6]

	pr, err := strconv.Atoi(args[7])

	if err != nil {
		return shim.Error(err.Error())
	}

	product.Price = pr
	product.Avail = args[8]
	product.Category = args[9]
	product.Featured = args[10]
	productAsBytes, _ = json.Marshal(product)
	APIstub.PutState(args[0], productAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) changeProductAdmin(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	productAsBytes, _ := APIstub.GetState(args[0])
	product := Product{}

	json.Unmarshal(productAsBytes, &product)
	product.Verified = "YES"

	productAsBytes, _ = json.Marshal(product)
	APIstub.PutState(args[0], productAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) changeUserState(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	userAsBytes, _ := APIstub.GetState(args[0])
	user := User{}

	json.Unmarshal(userAsBytes, &user)
	//user.State = args[1]
	user.Name = args[1]
	user.Image = args[2]
	user.Age = args[3]
	user.City = args[4]
	user.Country = args[5]
	user.Gender = args[6]
	user.Phone = args[7]

	userAsBytes, _ = json.Marshal(user)
	APIstub.PutState(args[0], userAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getHistoryForTrack(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	trackName := args[0]

	fmt.Printf("- Initiation of getHistoryForTrack: %s\n", trackName)

	resultsIterator, err := stub.GetHistoryForKey(trackName)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array
	// tracks timestamps are in this array
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {
		qresponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Transaction Id\":")
		buffer.WriteString("\"")
		buffer.WriteString(qresponse.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")

		if qresponse.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(qresponse.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(qresponse.Timestamp.Seconds, int64(qresponse.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(qresponse.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")

		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForTrack:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) delete(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var jsonResp string
	var assetJSON Product
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	structName := args[0]

	valAsbytes, err := stub.GetState(structName)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + structName + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"Asset does not exist: " + structName + "\"}"
		return shim.Error(jsonResp)
	}

	err = json.Unmarshal([]byte(valAsbytes), &assetJSON)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to decode JSON of: " + structName + "\"}"
		return shim.Error(jsonResp)
	}

	err = stub.DelState(structName)
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
	}

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
