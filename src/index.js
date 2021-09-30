import fs from "fs"
import path from "path"
import { title } from "process";

const songmapper = song => {
    try {
        const subtitle_parts = song.subtitle.replace("\r\n", "").replace("\\r\\n", "").match(/<div class="rs-list-item--year">(\d*)<\/div>.*<span class="rs-list-item--credits__names">(.*)(<\/span>)/)
        const title_parts = song.title.split(", '");
        const title = title_parts[1].substr(0, title_parts[1].length - 1)
        return {
            id: song.ID,
            position: song.positionDisplay,
            artist: title_parts[0],
            title: title,
            year: subtitle_parts[1],
            writers: subtitle_parts[2].split(", "),
            // subtitle: song.subtitle,
            slug: song.slug,
            description: song.description,
            image: song.image,
            appleSongID: song.appleSongID
        }
    } catch(err) {
        console.log(err);
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