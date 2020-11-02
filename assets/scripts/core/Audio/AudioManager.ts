/**
 * 音乐音效设置
 * 
 * 
 */
import GameDataManager from "../Data/GameDataManager";
import { LoaderManager } from "../Loader/LoaderManager";

export default class AudioManager {
    private static instance: AudioManager;
    public static getInstance(): AudioManager
    {
        if(this.instance == null)
        {
            this.instance = new AudioManager();
        }
        return this.instance;
    }
    static AUDIO_URL ='audios/';
    musicVolume:number =  0.7; 
    soundVolume:number =  0.7;
    bgMusicAudioID:number = -1; //当前背景音乐的ID
    init(){
        this.musicVolume = GameDataManager.getInstance().userLocalData.musicVolume
        this.soundVolume = GameDataManager.getInstance().userLocalData.soundVolume
    }
    //播放音乐
    playMusic(url:string){
        var self = this;
        LoaderManager.getInstance().loadAudio(AudioManager.AUDIO_URL + url,(clip)=>{
            // let audioClip:any = clip
            if(this.bgMusicAudioID >= 0){
                cc.audioEngine.stop(this.bgMusicAudioID);
            }
            this.bgMusicAudioID = cc.audioEngine.play(clip,true,this.musicVolume);
        })

    }
    //播放音效
    playSound(url:string){
        
        LoaderManager.getInstance().loadAudio(AudioManager.AUDIO_URL + url,(clip)=>{
            var audioID = cc.audioEngine.play(clip, false,this.musicVolume);
        })
    }
    //设置音效大小
    setSoundVolume(v:number){
        if(this.soundVolume != v){
            this.soundVolume = v;
            GameDataManager.getInstance().userLocalData.setSoundVolume(this.soundVolume)
        }
    }
    //设置音乐大小
    setMusicVolume(v:number){
        if(this.bgMusicAudioID >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgMusicAudioID);//恢复播放指定的音频
            }
            else{
                cc.audioEngine.pause(this.bgMusicAudioID);//暂停正在播放音频。
            }
        }
        if(this.musicVolume != v){
            this.musicVolume = v;
            cc.audioEngine.setVolume(this.bgMusicAudioID,v);//设置音量（0.0 ~ 1.0）
            GameDataManager.getInstance().userLocalData.setMusicVolume(this.musicVolume)
        }
    }
    //暂停现在正在播放的所有音频。
    pauseAll(){
        cc.audioEngine.pauseAll();
    }
    //恢复播放所有之前暂停的所有音频。
    resumeAll(){
        cc.audioEngine.resumeAll();
    }
}
