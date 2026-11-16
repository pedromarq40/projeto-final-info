import { Navigate } from "react-router-dom"

export default function ProtectedRoute({children, condition, redirectTo='/'}){
  return condition ? children : <Navigate to={redirectTo} replace />
}