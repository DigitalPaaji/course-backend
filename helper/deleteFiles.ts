import path from "path";
import fs from "fs"

export const deleteVideo = async(videoPath:string)=>{
try {
      if (!videoPath) return;
    const filePAth = path.join(process.cwd(),"uploads",videoPath);
if(!fs.existsSync(filePAth)){
return
}

fs.promises.unlink(filePAth)

} catch (error) {
    
}
}