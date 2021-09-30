import fs from "fs"
import path from "path"

const songmapper = song => {
    try {
        const parts = song.subtitle.replace("\r\n", "").replace("\\r\\n", "").match(/<div class="rs-list-item--year">(\d*)<\/div>.*<span class="rs-list-item--credits__names">(.*)(<\/span>)/)
        return {
            id: song.ID,
            position: song.positionDisplay,
            title: song.title,
            year: parts[1],
            writers: parts[2].split(", "),
            // subtitle: song.subtitle,
            slug: song.slug,
            description: song.description,
            image: song.image,
            appleSongID: song.appleSongID
        }
    } catch(err) {
        console.log(song.subtitle);
    }
}

const main = async () => {
    const files = fs.readdirSync("./raw")
    let songs = []
    for (let file of files) {
        const json = JSON.parse(fs.readFileSync(path.join("./raw", file)));
        songs = [...json.gallery, ...songs]
    }
    songs = songs.map(songmapper).sort((a, b) => b.position - a.position);
    fs.writeFileSync(path.join("./data", "rollingstone-top-500-songs.json"), JSON.stringify(songs, null, "   "));
    fs.writeFileSync(path.join("./data", "rollingstone-top-500-songs.min.json"), JSON.stringify(songs));
    console.log(`Wrote ${songs.length} songs`)
}
main()