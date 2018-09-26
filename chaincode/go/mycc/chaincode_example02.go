/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	//"encoding/binary"
	"fmt"
	"strconv"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	//pb "github.com/hyperledger/fabric/protos/peer"
	sc "github.com/hyperledger/fabric/protos/peer"
	"time"
	"strings"
	"errors"
	"encoding/pem"
	"crypto/x509"
	"github.com/nu7hatch/gouuid"
	"math/rand"
	"math"
)

var logger = shim.NewLogger("SmartContract")

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library

type User struct {
	ObjectType string  `json:"docType"`
	Username   string  `json:"username"`
	Password   string  `json:"password"`
	Balance    float64 `json:"balance"`
	Org        string  `json:"org"`
	Blocked    int     `json:"blocked"`
	Confirmed  int     `json:"confirmed"`
	Created    time.Time
}

type Log struct {
	ObjectType string `json:"docType"`
	Value      string `json:"value"`
	Created    time.Time
}


type DepositHistory struct {
	ObjectType      string  `json:"docType"`
	User            string  `json:"user"`
	Account         string  `json:"account"`
	Amount          float64 `json:"amount"`
	TotalProfitPaid float64
	ProfitPaidAt    time.Time
	Created         time.Time
}

type DepositAccount struct {
	ObjectType string  `json:"docType"`
	ProfitRate float64 `json:"profitRate"`
	Name       string  `json:"name"`
	Owner      string  `json:"owner"`
	Balance    float64 `json:"balance"`
	Blocked    int     `json:"blocked"`
	Active     int     `json:"active"`
	Created    time.Time
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) sc.Response {
	//initUser(stub, "admin.b", "b")
	//initUser(stub, "admin.c", "c")
	t.init(stub)
	return shim.Success([]byte("Admins for Orgs b and c created"))
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := stub.GetFunctionAndParameters()

	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "registerUser" {
		return t.registerUser(stub, args)
	} else if function == "confirmUser" {
		return t.confirmUser(stub, args)
	} else if function == "unConfirmUser" {
		return t.unConfirmUser(stub, args)
	} else if function == "blockUser" {
		return t.blockUser(stub, args)
	} else if function == "unBlockUser" {
		return t.unBlockUser(stub, args)
	} else if function == "queryUser" {
		return t.queryUser(stub, args)
	} else if function == "queryAllUsers" {
		return t.queryAllUsers(stub, args)
	} else if function == "transferMoney" {
		return t.transferMoney(stub, args)
	} else if function == "queryUserBalance" {
		return t.queryUserBalance(stub, args)
	} else if function == "generateMoney" {
		return t.generateMoney(stub, args)
	} else if function == "loginUser" {
		return t.loginUser(stub, args)
	} else if function == "queryActiveUsers" {
		return t.queryActiveUsers(stub, args)
	} else if function == "queryAllLogs" {
		return t.queryAllLogs(stub, args)
	} else if function == "queryActiveDepositAccounts" {
		return t.queryActiveDepositAccounts(stub, args)
	} else if function == "deposit" {
		return t.deposit(stub, args)
	} else if function == "payProfits" {
		return t.payProfits(stub, args)
	} else if function == "calculateProfits" {
		return t.calculateProfits(stub, args)
	} else if function == "queryUserDeposits" {
		return t.queryUserDeposits(stub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}
func (t *SmartContract) init(stub shim.ChaincodeStubInterface) sc.Response {
	initUser(stub, "admin.b", "b", 0)
	initUser(stub, "admin.c", "c", 0)
	initUser(stub, "user1", "a", 1000)
	initUser(stub, "user2", "a", 1000)
	createDepositAccount(stub, "admin.b", 0, 15)
	return shim.Success([]byte("Admins for Orgs b and c created"))
}

// ===============================================
// registerUser - register user
// ===============================================
func (t *SmartContract) registerUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// args username, password, confirmed, blocked
	var username, password, org string
	var confirmed, blocked int

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, adminOrg := getCreator(creatorBytes)
	if adminOrg != "a" {
		return shim.Error("permission denied: " + adminOrg)
	}
	//Admin@registry.avalblock.com registry

	//var username, password, confirmed, blocked
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	objectType := "user"
	username = args[0]
	password = args[1]
	org = args[2]
	confirmed = 0
	blocked = 0
	/*confirmed, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("3rd argument must be a numeric string")
	}
	blocked, err = strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("4th argument must be a numeric string")
	}*/
	created := time.Now()
	var user = User{ObjectType: objectType, Username: username, Password: password, Balance: float64(0), Confirmed: confirmed, Blocked: blocked, Created: created, Org: org}

	// ==== Check if user already exists ====
	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return shim.Error("Failed to get user: " + err.Error())
	} else if userAsBytes != nil {
		fmt.Println("Username already exists: " + username)
		return shim.Error("This username already exists: " + username)
	}

	// ==== Create user object and marshal to JSON ====
	userJSONasBytes, err := json.Marshal(user)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Save user to state ===
	err = stub.PutState(username, userJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	createLog(stub, username+" registered.")
	//var txId = stub.GetTxID()
	return shim.Success(userJSONasBytes)
}

// ===========================================================
// transfer money from my account to another user
// ===========================================================
func (t *SmartContract) transferMoney(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// args srcUsername dstUsername amountStr
	var srcUsername, dstUsername, amountStr string
	var err error
	var amount float64

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	srcUsername = args[2]
	dstUsername = args[3]
	amountStr = args[4]

	amount, _ = strconv.ParseFloat(strings.TrimSpace(amountStr), 64)

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "a" {
		return shim.Error("permission denied: " + org)
	}

	srcUserAsBytes, err := stub.GetState(srcUsername)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if srcUserAsBytes == nil {
		return shim.Error("User does not exist")
	}

	srcUser := User{}
	err = json.Unmarshal(srcUserAsBytes, &srcUser) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	if srcUser.Confirmed != 1 {
		return shim.Error("Sender user is not confirmed. Aborted.")
	}

	if srcUser.Blocked == 1 {
		return shim.Error("Sender user is blocked. Aborted.")
	}

	if srcUser.Balance < amount {
		return shim.Error("Account balance insufficient.")
	}

	dstUserAsBytes, err := stub.GetState(dstUsername)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if dstUserAsBytes == nil {
		return shim.Error("User does not exist")
	}

	dstUser := User{}
	err = json.Unmarshal(dstUserAsBytes, &dstUser) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	if dstUser.Confirmed != 1 {
		return shim.Error("Receiver user is not confirmed. Aborted.")
	}

	if dstUser.Blocked == 1 {
		return shim.Error("Receiver user is blocked. Aborted.")
	}

	srcUser.Balance = srcUser.Balance - amount

	srcUserJSONasBytes, _ := json.Marshal(srcUser)
	err = stub.PutState(srcUsername, srcUserJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}

	dstUser.Balance = dstUser.Balance + amount

	dstUserJSONasBytes, _ := json.Marshal(dstUser)
	err = stub.PutState(dstUsername, dstUserJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}
	var txId = stub.GetTxID()
	createLog(stub, fmt.Sprintf("%s >>> %s : %s", srcUsername, dstUsername, amountStr))
	fmt.Println("- Money trasferred successfully.")
	return shim.Success([]byte(txId))
}

// ===========================================================
// add money to user balance
// ===========================================================
func (t *SmartContract) generateMoney(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// args username amountStr
	var username, amountStr string
	var amount float64

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	err := authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[2]
	amountStr = args[3]

	amount, _ = strconv.ParseFloat(strings.TrimSpace(amountStr), 64)

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "c" {
		return shim.Error("permission denied: " + org)
	}

	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if userAsBytes == nil {
		return shim.Error("User does not exist")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	if user.Confirmed != 1 {
		return shim.Error("User is not confirmed. Aborted.")
	}

	if user.Blocked == 1 {
		return shim.Error("User is blocked. Aborted.")
	}

	user.Balance = user.Balance + amount

	userJSONasBytes, _ := json.Marshal(user)
	err = stub.PutState(username, userJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	var txId = stub.GetTxID()
	createLog(stub, fmt.Sprintf("Generated for %s : %s", username, amountStr))
	fmt.Println("- Money generated successfully.")
	return shim.Success([]byte(txId))
}

// ===========================================================
// confirm user by username
// ===========================================================
func (t *SmartContract) confirmUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// args username
	var username string

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "b" {
		return shim.Error("permission denied: " + org)
	}

	//   0       
	// "username"
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[2]

	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if userAsBytes == nil {
		return shim.Error("User does not exist")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	user.Confirmed = 1
	//user.Balance = float64(1000)

	userJSONasBytes, _ := json.Marshal(user)
	err = stub.PutState(username, userJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- User confirmed successfully!")
	createLog(stub, fmt.Sprintf("%s confirmed.", username))

	return shim.Success(userAsBytes)
}

// ===========================================================
// un-confirm user by username
// ===========================================================
func (t *SmartContract) unConfirmUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// args username
	var username string

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "b" {
		return shim.Error("permission denied: " + org)
	}

	//   0       
	// "username"
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[2]

	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if userAsBytes == nil {
		return shim.Error("User does not exist")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	user.Confirmed = 0 //change the owner

	userJSONasBytes, _ := json.Marshal(user)
	err = stub.PutState(username, userJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- User unconfirmed successfully!")
	createLog(stub, fmt.Sprintf("%s unconfirmed.", username))

	return shim.Success(nil)
}

// ===========================================================
// block user by username
// ===========================================================
func (t *SmartContract) blockUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// args username
	var username string

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "b" {
		return shim.Error("permission denied: " + org)
	}

	//   0       
	// "username"
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[2]

	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if userAsBytes == nil {
		return shim.Error("User does not exist")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	user.Blocked = 1 //change the owner

	userJSONasBytes, _ := json.Marshal(user)
	err = stub.PutState(username, userJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- User blocked successfully!")
	createLog(stub, fmt.Sprintf("%s blocked.", username))

	return shim.Success(userAsBytes)
}

// ===========================================================
// un-block user by username
// ===========================================================
func (t *SmartContract) unBlockUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// args username
	var username string

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "b" {
		return shim.Error("permission denied: " + org)
	}
	//   0       
	// "username"
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[2]

	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if userAsBytes == nil {
		return shim.Error("User does not exist")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	user.Blocked = 0

	userJSONasBytes, _ := json.Marshal(user)
	err = stub.PutState(username, userJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- User unblocked successfully!")
	createLog(stub, fmt.Sprintf("%s unblocked.", username))

	return shim.Success(userAsBytes)
}

// ===========================================================
// queryAllUsers query all users
// ===========================================================
func (t *SmartContract) queryAllUsers(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	err := authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	//TODO org is hard-coded
	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"user\", \"org\":\"a\"}}")

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

// ===========================================================
// queryActiveUsers query all users who are confirmed and not blocked
// ===========================================================
func (t *SmartContract) queryActiveUsers(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	err := authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	//TODO org is hard-coded
	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"user\", \"username\":{\"$ne\":\"%s\"}, \"confirmed\":%d, \"blocked\":%d, \"org\":\"a\"}}", args[0], 1, 0)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

// ===============================================
// queryUser - query a user from chaincode state
// ===============================================
func (t *SmartContract) queryUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var username, jsonResp string
	var err error

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3.")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[2]
	valAsbytes, err := stub.GetState(username) //get the car from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + username + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"User does not exist: " + username + "\"}"
		return shim.Error(jsonResp)
	}
	return shim.Success(valAsbytes)
}

// ===============================================
// queryUserBalance - query user balance
// ===============================================
func (t *SmartContract) queryUserBalance(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var username, jsonResp string
	var err error

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3.")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[2]
	userAsBytes, err := stub.GetState(username) //get the car from chaincode state

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + username + "\"}"
		return shim.Error(err.Error())
	} else if userAsBytes == nil {
		jsonResp = "{\"Error\":\"User does not exist: " + username + "\"}"
		return shim.Error(jsonResp)
	}
	return shim.Success([]byte(strconv.FormatFloat(user.Balance, 'f', 6, 64)))
}

// ===============================================
// LoginUser - login chain user
// ===============================================
func (t *SmartContract) loginUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var username, passwordHash, jsonResp string
	var err error

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting username and passwordHash to query")
	}

	username = args[0]
	passwordHash = args[1]

	userAsBytes, err := stub.GetState(username) //get the user from chaincode state
	if err != nil {
		return shim.Error(err.Error())
	} else if userAsBytes == nil {
		jsonResp = "{\"Error\":\"User does not exist: " + username + "\"}"
		return shim.Error(jsonResp)
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	if user.Password == passwordHash {
		return shim.Success(userAsBytes)
	} else {
		//resp := sc.Response{Message: "AAAA", Payload: nil, Status: 404}
		jsonResp = "{\"Error\":\"Password not correct.\"}"
		return shim.Error(jsonResp)
	}
}

// ===========================================================
// Helper function: check if user is blocked
// ===========================================================
func checkBlocked(stub shim.ChaincodeStubInterface, username string) error {
	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return errors.New("error occurred")
	} else if userAsBytes == nil {
		return errors.New("user not found")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return errors.New("error occurred")
	}
	if user.Blocked == 1 {
		return errors.New("user is blocked")
	} else {
		return nil
	}
}

// ===========================================================
// Helper function: check if user is confirmed
// ===========================================================
func checkConfirmed(stub shim.ChaincodeStubInterface, username string) error {
	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return errors.New("error occurred")
	} else if userAsBytes == nil {
		return errors.New("user not found")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return errors.New("error occurred")
	}
	if user.Confirmed == 1 {
		return nil
	} else {
		return errors.New("user not confirmed")
	}
}

// ===========================================================
// Helper function: check if username and password are valid
// ===========================================================
func authenticate(stub shim.ChaincodeStubInterface, username string, passwordHash string) error {
	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return errors.New("error occurred")
	} else if userAsBytes == nil {
		return errors.New("user not found")
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return errors.New("error occurred")
	}
	if user.Password == passwordHash {
		return nil
	} else {
		return errors.New("invalid credentials")
	}
}

// ===========================================================
// Helper function: get user by username
// ===========================================================
func getUser(stub shim.ChaincodeStubInterface, username string) (User, error) {
	user := User{}
	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return user, errors.New("error occurred")
	} else if userAsBytes == nil {
		return user, errors.New("user not found")
	}

	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return user, errors.New("error occurred")
	}
	return user, err
}

func (t *SmartContract) getHistoryForCar(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carModel := args[0]

	fmt.Printf("- start getHistoryForCar: %s\n", carModel)

	resultsIterator, err := stub.GetHistoryForKey(carModel)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the car
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON car)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForCar returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
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

	// buffer is a JSON array containing QueryRecords
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

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

var getCreator = func(certificate []byte) (string, string) {
	data := certificate[strings.Index(string(certificate), "-----") : strings.LastIndex(string(certificate), "-----")+5]
	block, _ := pem.Decode([]byte(data))
	cert, _ := x509.ParseCertificate(block.Bytes)
	organization := cert.Issuer.Organization[0]
	commonName := cert.Subject.CommonName

	logger.Debug("commonName: " + commonName + ", organization: " + organization)

	organizationShort := strings.Split(organization, ".")[0]

	return commonName, organizationShort
}

func initUser(stub shim.ChaincodeStubInterface, username string, org string, balance float64) (User, error) {
	// password 123456
	created := time.Now()
	user := User{ObjectType: "user", Username: username, Password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", Balance: float64(balance), Confirmed: 1, Blocked: 0, Created: created, Org: org}

	// ==== Check if user already exists ====
	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return user, errors.New("checking failed. Aborted")
	} else if userAsBytes != nil {
		return user, errors.New("username already exists: " + username)
	}

	// ==== Create user object and marshal to JSON ====
	userJSONasBytes, err := json.Marshal(user)
	if err != nil {
		return user, errors.New(err.Error())
	}

	// === Save user to state ===
	err = stub.PutState(username, userJSONasBytes)
	if err != nil {
		return user, errors.New(err.Error())
	}
	return user, err
}

func createLog(stub shim.ChaincodeStubInterface, text string) error {
	created := time.Now()
	log := &Log{ObjectType: "log", Value: text, Created: created}
	logJSONasBytes, err := json.Marshal(log)
	if err != nil {
		return errors.New(err.Error())
	}
	// === Save car to state ===
	id, err := uuid.NewV4()
	err = stub.PutState(id.String(), logJSONasBytes)
	if err != nil {
		return errors.New(err.Error())
	}
	return nil
}

// ===========================================================
// queryAllLogs query all logs
// ===========================================================
func (t *SmartContract) queryAllLogs(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"log\"}, \"sort\": [{\"Created\": \"desc\"}]}")

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func createDepositAccount(stub shim.ChaincodeStubInterface, owner string, balance float64, profitRate float64) (DepositAccount, error) {

	var account = newAccount(owner, balance, profitRate)
	// ==== Check if account already exists ====
	var isAccountExist = true
	for isAccountExist {
		accountAsBytes, err := stub.GetState(account.Name)
		if err != nil {
			return account, errors.New("checking failed. Aborted")
		} else if accountAsBytes != nil {
			account = newAccount(owner, balance, profitRate)
		} else if accountAsBytes == nil {
			isAccountExist = false
		}
	}

	// ==== Create account object and marshal to JSON ====
	accountJSONasBytes, err := json.Marshal(account)
	if err != nil {
		return account, errors.New(err.Error())
	}

	// === Save account to state ===
	err = stub.PutState(account.Name, accountJSONasBytes)
	if err != nil {
		return account, errors.New(err.Error())
	}
	return account, err
}

// ===========================================================
// initiate account instance and return it
// ===========================================================
func newAccount(owner string, balance float64, profitRate float64) DepositAccount {
	created := time.Now()
	rand.Seed(time.Now().UnixNano())
	var name = `da-` + owner + `-` + strconv.Itoa(rand.Intn(1000))
	account := DepositAccount{ObjectType: "depositAccount", Name: name, Owner: owner, ProfitRate: profitRate, Balance: float64(balance), Active: 1, Blocked: 0, Created: created}
	return account
}

// ===========================================================
// query active deposit accounts
// ===========================================================
func (t *SmartContract) queryActiveDepositAccounts(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments.")
	}

	err := authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	/*creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "a" {
		return shim.Error("permission denied: " + org)
	}*/
	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"depositAccount\", \"active\":1}, \"sort\": [{\"Created\": \"desc\"}]}")

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

// ===========================================================
// transfer money from user to deposit account
// ===========================================================
func (t *SmartContract) deposit(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	// username, password, accountName, amount
	var accountName, username, amountStr string
	var err error
	var amount float64

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	err = authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	username = args[0]
	accountName = args[2]
	amountStr = args[3]

	amount, _ = strconv.ParseFloat(strings.TrimSpace(amountStr), 64)

	if amount <= 0 {
		return shim.Error("Invalid amount!")
	}

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "a" {
		return shim.Error("permission denied: " + org)
	}

	userAsBytes, err := stub.GetState(username)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	}

	user := User{}
	err = json.Unmarshal(userAsBytes, &user) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	if user.Confirmed != 1 {
		return shim.Error("User is not confirmed. Aborted.")
	}

	if user.Blocked == 1 {
		return shim.Error("User is blocked. Aborted.")
	}

	if user.Balance < amount {
		return shim.Error("User account balance is insufficient.")
	}

	accountAsBytes, err := stub.GetState(accountName)
	if err != nil {
		return shim.Error("Failed to get user:" + err.Error())
	} else if accountAsBytes == nil {
		return shim.Error("Account does not exist")
	}

	account := DepositAccount{}
	err = json.Unmarshal(accountAsBytes, &account) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	if account.Active != 1 {
		return shim.Error("Account is not active. Aborted.")
	}

	if account.Blocked == 1 {
		return shim.Error("Account is blocked. Aborted.")
	}

	user.Balance = user.Balance - amount

	userJSONasBytes, _ := json.Marshal(user)
	err = stub.PutState(user.Username, userJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}

	account.Balance = account.Balance + amount

	accountJSONasBytes, _ := json.Marshal(account)
	err = stub.PutState(account.Name, accountJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}
	createDepositHistory(stub, username, amount, accountName)
	var txId = stub.GetTxID()
	createLog(stub, fmt.Sprintf("Deposit: %s >>> %s | %s", username, accountName, amountStr))

	fmt.Println("- Deposit done successfully.")
	return shim.Success([]byte(txId))
}

func createDepositHistory(stub shim.ChaincodeStubInterface, username string, amount float64, account string) error {
	now := time.Now()
	//created := now.AddDate(0, 0, -2)
	created := now
	profitPaidAt := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	depositHistory := &DepositHistory{ObjectType: "depositHistory", User: username, Amount: amount, Account: account, Created: created, ProfitPaidAt: profitPaidAt}
	historyJSONasBytes, err := json.Marshal(depositHistory)
	if err != nil {
		return errors.New(err.Error())
	}
	// === Save history to state ===
	id, err := uuid.NewV4()
	err = stub.PutState(id.String(), historyJSONasBytes)
	if err != nil {
		return errors.New(err.Error())
	}
	return nil
}

func getAccountByName(stub shim.ChaincodeStubInterface, name string) (DepositAccount, error) {
	accountAsBytes, err := stub.GetState(name)
	account := DepositAccount{}
	err = json.Unmarshal(accountAsBytes, &account) //unmarshal it aka JSON.parse()
	if err != nil {
		return account, errors.New("checking failed. Aborted")
	} else if accountAsBytes == nil {
		return account, errors.New("account empty")
	}

	if err != nil {
		return account, errors.New("checking failed. Aborted")
	}
	return account, nil
}

func (t *SmartContract) calculateProfits(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var accountName string
	var profitAmount float64

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments.")
	}

	err := authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	accountName = args[2]
	customProfitRate, err := strconv.ParseFloat(args[3], 64)
	if err != nil {
		return shim.Error(err.Error())
	}

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "b" {
		return shim.Error("permission denied: " + org)
	}

	var account, accountErr = getAccountByName(stub, accountName)
	if accountErr != nil {
		return shim.Error(err.Error())
	}

	var profitRate = account.ProfitRate
	if customProfitRate != 0 {
		profitRate = customProfitRate
	}

	var now = time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"depositHistory\", \"account\":\"%s\", \"ProfitPaidAt\":{\"$lt\":\"%s\"}}, \"sort\": [{\"Created\": \"desc\"}]}", accountName, today.Format(time.RFC3339))

	queryResults, err := getQueryResultForDepositHistory(stub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}
	result := make(map[string]float64)

	for _, element := range queryResults {
		// Put data into map
		var daysDiff = int(Round(float64(today.Unix() - element.ProfitPaidAt.Unix()) / (24 * 60 * 60), 1, 0))
		profitAmount = math.Floor((element.Amount * (profitRate / 100.0) * (float64(daysDiff) / 365))*100)/100
		if profitAmount == 0 {
			continue
		}
		result[element.User] = profitAmount
	}

	empData, err := json.Marshal(result)
	if err != nil {
		fmt.Println(err.Error())
		return shim.Error(err.Error())
	}
	return shim.Success([]byte(empData))
}

func Round(val float64, roundOn float64, places int ) (newVal float64) {
	var round float64
	pow := math.Pow(10, float64(places))
	digit := pow * val
	_, div := math.Modf(digit)
	if div >= roundOn {
		round = math.Ceil(digit)
	} else {
		round = math.Floor(digit)
	}
	newVal = round / pow
	return
}

func (t *SmartContract) payProfits(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var accountName string

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments.")
	}

	err := authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	accountName = args[2]
	customProfitRate, err := strconv.ParseFloat(args[3], 64)
	if err != nil {
		return shim.Error(err.Error())
	}

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "b" {
		return shim.Error("permission denied: " + org)
	}

	var account, accountErr = getAccountByName(stub, accountName)
	if accountErr != nil {
		return shim.Error(err.Error())
	}

	var profitRate = account.ProfitRate
	if customProfitRate != 0 {
		profitRate = customProfitRate
	}

	var now = time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"depositHistory\", \"account\":\"%s\", \"ProfitPaidAt\":{\"$lt\":\"%s\"}}, \"sort\": [{\"Created\": \"desc\"}]}", accountName, today.Format(time.RFC3339))

	queryResults, err := getQueryResultForDepositHistory(stub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}
	result := make(map[string]float64)

	for key, element := range queryResults {
		// Add profit amount to user balance
		var user, _ = getUser(stub, element.User)

		var daysDiff = int(Round(float64(today.Unix() - element.ProfitPaidAt.Unix()) / (24 * 60 * 60), 1, 0))

		//var daysNotPaid = now.Sub(element.ProfitPaidAt).Hours() / 24
		var profitAmount = math.Floor((element.Amount * (profitRate / 100.0) * (float64(daysDiff) / 365))*100)/100
		if profitAmount == 0 {
			continue
		}
		user.Balance += profitAmount
		userJSONasBytes, _ := json.Marshal(user)
		err = stub.PutState(element.User, userJSONasBytes)
		if err != nil {
			return shim.Error(err.Error())
		}
		// Update ProfitPaidAt and TotalProfitPaid fields in depositHistory
		element.ProfitPaidAt = today
		element.TotalProfitPaid += profitAmount
		depositHistoryJSONasBytes, _ := json.Marshal(element)
		err = stub.PutState(key, depositHistoryJSONasBytes)
		if err != nil {
			return shim.Error(err.Error())
		}
		result[element.User] = element.TotalProfitPaid
		createLog(stub, fmt.Sprintf("Profit paid to user `%s`, for Account `%s`, Amount paid `%v`", element.User, accountName, profitAmount))
	}

	if len(result) == 0 {
		return shim.Error("No profit to pay.")
	}

	empData, err := json.Marshal(result)
	if err != nil {
		fmt.Println(err.Error())
		return shim.Error(err.Error())
	}
	return shim.Success([]byte(empData))
}

func getQueryResultForDepositHistory(stub shim.ChaincodeStubInterface, queryString string) (map[string]DepositHistory, error) {

	fmt.Printf("- getQueryResultForDepositHistory queryString:\n%s\n", queryString)
	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	histories := make(map[string]DepositHistory)

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var response = []byte(queryResponse.Value)
		var history = DepositHistory{}
		jsonErr := json.Unmarshal(response, &history)
		if jsonErr != nil {
			return nil, jsonErr
		}
		histories[queryResponse.Key] = history
	}
	return histories, nil
}

func (t *SmartContract) queryUserDeposits(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments.")
	}

	err := authenticate(stub, args[0], args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	var username = args[0]

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error(err.Error())
	}
	_, org := getCreator(creatorBytes)

	if org != "a" {
		return shim.Error("permission denied: " + org)
	}

	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"depositHistory\", \"user\":\"%s\"}, \"sort\": [{\"Created\": \"desc\"}]}", username)

	queryResults, err := getQueryResultForQueryString(stub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

// The main function is only relevant in unit main mode. Only included here for completeness.
func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
