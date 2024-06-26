import React , {useState , useMemo} from 'react'

function UserProfile() {

  const [ show , setShow] = useState(false);

  const [inc , setInc] = useState(0);

  
  const callMe = (i)=>{
    console.log("why you called me" , i);
    return i;
  }
  
  useMemo(()=>{
    const a = callMe(show);
    console.log(a);
  },[show]);

  return (
    <div>
      <br/>
      <br/>
      <br/>
            <p>{inc}</p>
            <button onClick={()=>{setInc(inc+1)}}>Increase</button>
            <br/>
            <button onClick={()=>{setShow(!show)}}>Call me</button>
    </div>
  )
}

export default UserProfile
