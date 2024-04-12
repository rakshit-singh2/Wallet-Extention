document.getElementById("form").addEventListener("click", handler);
document.getElementById("send_otp").addEventListener("click", sendOTP);
document.getElementById("add_user").addEventListener("click", verifyAndAddUser);
document.getElementById("check_balance").addEventListener("click", checkBalance);
const user = { 
        "kumarrakshit745@gmail.com" :
        { 
                "private_key": "0xee0146b6c4c5ade126f32d1ace30ec7bdceac6a4f11de512aa84a23ea1c45a6a",
                "public_key": "0x758f7C57c5024A307321a63f4d0b44Fd8fbdA604"
        }
}


let otp;

function sendOTP() {
    // Display loader while sending OTP
    document.getElementById("center").style.display = "flex";

    // Get user's email
    const email = document.getElementById("email").value;

    // Generate OTP
    otp = Math.floor(1000 + Math.random() * 9000);
    let subject = "Your OTP"
    let text = "Your OTP is "+otp.toString()
    // Send OTP via fetch
    fetch('http://localhost:4000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, subject, text })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error sending OTP');
        }
        document.getElementById("otpField").style.display = "block";
        document.querySelector(".otp_message").innerText = 'Enter OTP received in your email';
    })
    .catch(error => {
        console.error(error);
        document.querySelector(".otp_message").innerText = 'Error sending OTP';
    })
    .finally(() => {
        document.getElementById("center").style.display = "none";
    });
}

function verifyAndAddUser() {
        // Display loader while sending OTP
        document.getElementById("center").style.display = "flex";
    
        const private_key = document.getElementById("private_key").value;
        const address = document.getElementById("address").value;
        const email = document.getElementById("email").value;
    
        if( otp != document.getElementById("otpInput").value){
                document.querySelector(".otp_message").innerText = 'Sorry Wrong OTP'; 
        }
        else{
                const newUser = {
                        private_key: private_key,
                        public_key: address 
                };

                user[email] = newUser;
                document.querySelector(".otp_message").innerText = 'User added successfully';
        }
        document.getElementById("center").style.display = "none";

}
function handler() {
        document.getElementById("center").style.display = "flex";
        
        const email = document.getElementById("email").value;
        const amount = document.getElementById("amount").value;
        const address = document.getElementById("address").value;

        //PROVIDER
        const provider = new ethers.providers.JsonRpcProvider(
                "https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6"
        );
        if( otp != document.getElementById("otpInput").value){
                document.querySelector(".otp_message").innerText = 'Sorry Wrong OTP'; 
        }
        let wallet = new ethers.Wallet(user[email].private_key, provider);

        const tx = {
                to: address,
                value: ethers.utils.parseEther(amount),
        };
        
        var a = document.getElementById("link");
        a.href = "somelink url";
        wallet.sendTransaction(tx).then((txObj) => {
                console.log("txHash", txObj.hash);
                document.getElementById("center").style.display = "none";
                const a  = document.getElementById("link");
                a.href = `https://sepolia.etherscan.io/tx/${txObj.hash}`;
                document.getElementById("link").style.display = "block";
        });

}
function checkBalance() {
        document.getElementById("center").style.display = "flex";

        // Provider
        const provider = new ethers.providers.JsonRpcProvider(
                "https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6"
        );

        const signer = provider.getSigner();

        console.log(signer);
        const address = document.getElementById("address").value;
        console.log("address: ",address)
        provider.getBalance(address).then((balance) => {
                // convert a currency unit from wei to ether
                const balanceInEth = ethers.utils.formatEther(balance);
                document.getElementById(
                        "check_balance"
                ).innerText = `Your Balance: ${balanceInEth} ETH`;
                console.log(`balance: ${balanceInEth} ETH`);
                document.getElementById("center").style.display = "none";

        });
}