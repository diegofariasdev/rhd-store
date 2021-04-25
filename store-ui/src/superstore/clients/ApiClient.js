class ApiClient {

    fetchUrl(url, options, onSuccess, onError) {

        fetch(url, options)
            .then(function (res) {
                const json = res.json()
                if (res.ok) {
                    return json
                } else {
                    return json.then(err => {throw err})
                }
            })
            .then(
                (result) => {
                    onSuccess(result)
                },
                (error) => {
                    onError(error)
                }
            )
    }
}

export default ApiClient
