
class TimeManager {
    //minutes since start of the day
    static convertToMinutes(time) {
        console.log(time);
        const timeSplit = time.split(":");
        const minutes = parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]);
        return minutes;
    }

    static isTimeOverlap(startTime1, duration1, startTime2, duration2) {

        const start1 = this.convertToMinutes(startTime1);
        const start2 = this.convertToMinutes(startTime2);
        const end1 = start1 + duration1;
        const end2 = start2 + duration2;

        if (duration1 > duration2) {
            if (this.timePointWithinFrame(start1, end1, start2) || this.timePointWithinFrame(start1, end1, end2)) {
                return true;
            }
        } else {
            if (this.timePointWithinFrame(start2, end2, start1) || this.timePointWithinFrame(start2, end2, end1)) {
                return true;
            }
        }
        return false;   
    }

    //checks if second timeframe is within first
    static timeFrameWithinTimeFrame(startTime1, endTime1, startTime2, duration2) {
        const start1 = this.convertToMinutes(startTime1);
        const start2 = this.convertToMinutes(startTime2);
        const end1 = this.convertToMinutes(endTime1);
        const end2 = start2 + duration2;

        return this.timePointWithinFrame(start1, end1, start2) && this.timePointWithinFrame(start1, end1, end2);
    }

    //all parameters have to be in a number format
    //returns wether a point in time lies within a time frame
    static timePointWithinFrame(frameStart, frameEnd, timePoint) {
        return timePoint >= frameStart && timePoint <= frameEnd;
    }

    static isPast(date, time) {
        return new Date(`${date}T${time}`) < new Date();
    }
}

module.exports = TimeManager;