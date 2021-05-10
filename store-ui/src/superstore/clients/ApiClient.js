class ApiClient {

    fetchUrl(url, options, onSuccess, onError) {

        fetch(url, options)
            .then(function (res) {
                const json = res.json()
                if (res.ok) {
                    return json
                } else {
                    return json.then(err => {
                        err.status = res.status
                        throw err
                    })
                }
            })
            .then(
                (result) => {
                    onSuccess(result)
                },
                (error) => {
                    if(error.status === 403) {
                        window.location = '/#/403'
                    } else if(error.status === 404) {
                        window.location = '/#/404'
                    }
                    onError(error)
                }
            )
    }
}

export default ApiClient
