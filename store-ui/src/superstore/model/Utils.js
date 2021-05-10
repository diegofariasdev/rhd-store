
    function getLastStatus(statusArray) {
        const today = new Date()
        today.setDate(today.getDate() - 365)
        let lastStatus = {
            status : 'null',
            creationTimestamp : today.toString()
        }
        statusArray.forEach(item => {
            let itemDate = new Date(item.creationTimestamp)
            let lastStatusDate = new Date(lastStatus.creationTimestamp)
            if (itemDate.getTime() > lastStatusDate.getTime()) {
                lastStatus = item
            }
        })

        if (lastStatus.status === 'null') return null
        else return lastStatus
    }

export default getLastStatus
