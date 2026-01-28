import { useCommonAction } from "@/shared/model/common.store"

const HomePage = () => {
    const { removeToken } = useCommonAction()
    return (
        <div>
            <h1>HomePage</h1>
            <button onClick={() => {
                removeToken()
            }}>Logout</button>
        </div>
    )
}

export default HomePage