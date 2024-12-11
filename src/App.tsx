import {FormEvent, useState} from "react";
import {createUserWithEmailAndPassword} from "firebase/auth"
import {auth} from "./db/init_firebase.ts";
import {ToastContainer,toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [email,set_email] = useState("")
  const [password,set_password] = useState("")
  const [loading,set_loading] = useState<boolean>(false)

  const handle_submit = (e:FormEvent) => {
    e.preventDefault()
    set_loading(true)
    createUserWithEmailAndPassword(auth,email,password).then(()=>{
      toast("✅ Signed up successfully, we will notify you when Serviify is available!")
      set_email("")
      set_password("")
    }).catch(()=>{
      toast("⚠️ We ran into a problem, please try again later")
    }).finally(()=>{
      set_loading(false)
    })
  }
  return (
    <div className={"container min-vh-100 d-flex align-items-center justify-content-center"}>
        <div className={"row justify-content-center align-items-center "}>
          <div className={"col-sm text-center text-md-start"}>
              <img src={"./src/assets/logo.png"} className={"img-fluid mb-2"} width={"70"}/>
              <h1 className={"p_txt fw-bold"}>SERVIIFY</h1>

            <h5>Services At Your Fingertips</h5>
            <p>Sign Up for early access</p>
            <form onSubmit={handle_submit}>
            <div className={"mb-2 input-group"}>
              <span className={"input-group-text"}><i className="bi bi-envelope-at"></i></span>
              <input
                  type={"email"}
                  className={"form-control "}
                  placeholder={"Your Email"}
                  value={email}
                  onChange={(e)=>set_email(e.target.value)}
                  required={true}
              />
            </div>
            <div className={"mb-2 input-group"}>
              <span className={"input-group-text"}><i className="bi bi-key "></i></span>
              <input
                  type={"password"}
                  className={"form-control "}
                  placeholder={"Your Password"}
                  value={password}
                  onChange={(e)=>set_password(e.target.value)}
                  required={true}
              />
            </div>
            <div className={"mb-2"}>
              <span><small>By signing up you agree to be contacted in relation to Serviify services and custom offers</small></span>
            </div>
            <div>
              {!loading ?
                  <button type={"submit"} className={"btn p_btn"}>Sign Up</button>
                  :
                  <div className="spinner-border p_txt" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
              }
            </div>
            </form>
          </div>
          <div className={"col-sm"}>
          <img src={"https://ngratesc.sirv.com/i-claim/serviify/iPhone%2013%20Pro.png"} className={"img-fluid "} alt={"mockup"}/>
          </div>

        </div>
      <ToastContainer />
    </div>
  )
}

export default App
