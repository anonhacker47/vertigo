import{P as m,A as d}from"./AuthenticationService.f084adfd.js";import{r as o,R as p,o as n,a as i,h as e,k as l,t as u,i as _,b as f}from"./index.ba71b26d.js";const y={class:"flex justify-center items-center h-screen"},g=f("h1",{class:"text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"}," Create your Vertigo Account ",-1),h={key:0,class:"error py-5"},b={__name:"SignupView",setup(w){o(""),o(""),o("");const t=o("");async function c(r){try{const s=await d.register({username:r.username,email:r.email,password:r.password})}catch(s){t.value=s.response.data.errors}console.log(t)}return(r,s)=>{const a=p("FormKit");return n(),i("div",y,[e(m,null,{default:l(()=>[g,e(a,{type:"form","submit-label":"Sign up",onSubmit:c},{default:l(()=>[e(a,{type:"text",name:"username",label:"Username",validation:"required"}),e(a,{type:"email",name:"email",label:"Email Address",validation:"required|email|",placeholder:"demo@company.com"}),e(a,{type:"password",name:"password",label:"Password",validation:"required"}),e(a,{type:"password",name:"password_confirm",label:"Confirm Password",validation:"required|confirm","validation-label":"Password confirmation"}),t.value!=""?(n(),i("h1",h,u(t.value),1)):_("",!0)]),_:1})]),_:1})])}}};export{b as default};
