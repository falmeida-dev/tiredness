import { AmbientSoundCard } from "@/components/AmbientSoundCard";
import { CategoryTab } from "@/components/CategoryTab";
import { TrackCard } from "@/components/TrackCard";
import { getAmbientSounds, getMeditations } from "@/services/api";
import { AudioTrack } from "@/types/track";
import { Ionicons } from "@expo/vector-icons";
import { AudioPlayer, AudioStatus, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";



const TABS: {label: string; icon: keyof typeof Ionicons.glyphMap}[] = [
  {label: "Todas", icon: 'list-outline'},
  {label: "Ambiente", icon: 'leaf-outline'},
  { label: 'Relaxar', icon: 'heart-outline' },
  { label: 'Foco', icon: 'timer-outline' },
  { label: 'Dormir', icon: 'musical-notes-outline' },
];

const getIconAmbient = (title: string): keyof typeof Ionicons.glyphMap =>{
  if (title.includes('Chuva')) return 'rainy-outline';
  if (title.includes('Rio') || title.includes('Cachoeira')) return 'water-outline';
  if (title.includes('Pássaros')) return 'sunny-outline';
  if (title.includes('Fogueira')) return 'flame-outline';
  if (title.includes('Floresta')) return 'leaf-outline';
  return 'musical-note-outline'
}

const formatTime = (sec: number) =>{
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function MeditarScreen(){
  const [tab, setTab] = useState('Todas');
  const [meditacoes, setMeditacoes] = useState<AudioTrack[]>([]);
  const [ambientSound, setAmbientSound] = useState<AudioTrack[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);


  // player de música
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const trackSoundRef = useRef<AudioPlayer | null>(null);
  const load = useRef(0);

  // sons ambientes - pode tocar mais de um ao mesmo tempo
  const [activeSoundIds, setActiveSoundIds] = useState(new Set<string>());
  const [loadingSoundIds, setLoadingSoundIds] = useState(new Set<string>());
  const ambientRef = useRef(new Map<string, AudioPlayer>());

  useEffect(() =>{
    let montado = true;
    (async () =>{
        try {
         await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'mixWithOthers'});
         setCarregando(true); 
         const [meds, amb] = await Promise.all([getMeditations(), getAmbientSounds()]);
         if (montado) {setMeditacoes(meds); setAmbientSound(amb); }
        } catch (e)
        {
          if (montado) setErro('Erro ao carregar as músicas.');
        } finally{
          if (montado) setCarregando(false);
        }
      })()

    return () => {
      montado = false;
      load.current++;
      trackSoundRef.current?.remove();
      ambientRef.current.forEach(s => s.remove());
      ambientRef.current.clear();
    };


  }, []);

   const playTrack = async (track: AudioTrack) => {
    if(activeTrackId === track.id && trackSoundRef.current){
      isPlaying ? trackSoundRef.current.pause() : trackSoundRef.current.play();
      setIsPlaying(!isPlaying);
      return;
    }

    // para a música de antes se estiver tocando
    trackSoundRef.current?.remove();

    const gen = ++load.current;
    setActiveTrackId(track.id);
    setIsBuffering(true);
    setIsPlaying(false);

    try {
      const player = createAudioPlayer(track.audioUrl, {downloadFirst: false});
      player.addListener('playbackStatusUpdate', (status: AudioStatus)=>{
        if(load.current != gen) return;
        if(status.isLoaded){
          setIsPlaying(status.playing);
          setIsBuffering(status.isBuffering);
          if(status.didJustFinish) setActiveTrackId(null);
        }
      });

      player.play();
      trackSoundRef.current = player;

    } catch {
      if(load.current === gen) setActiveTrackId(null);
    }
   };

  //  liga ou desliga os barulhos ambientes
   const tunrOnOrOffAmbient = async (track: AudioTrack) =>{
    if(activeSoundIds.has(track.id)){
      ambientRef.current.get(track.id)?.remove();
      ambientRef.current.delete(track.id);
      setActiveSoundIds(prev => { const n = new Set(prev); n.delete(track.id); return n;})
    }else{
      if(ambientRef.current.has(track.id)) return;
      try {
        setLoadingSoundIds(prev => new Set([...prev, track.id]));
        const player = createAudioPlayer(track.audioUrl);
        player.loop = true;
        player.addListener('playbackStatusUpdate', s => {
          if(s.isLoaded && !s.isBuffering){
            setLoadingSoundIds(prev => { const n = new Set(prev); n.delete(track.id); return n;})
          }
        });
        player.play();
        ambientRef.current.set(track.id, player);
        setActiveSoundIds(prev => new Set([...prev, track.id]));
      } catch {
        setLoadingSoundIds(prev => {const n = new Set(prev); n.delete(track.id); return n; })
      }
    }
   };

  //  filtra as músicas de acordo com o que foi escolhido na aba
  const filterCategory = meditacoes.filter( t =>{
    if(tab === 'Todas') return true;
    const low = t.title.toLowerCase();

    if (tab == 'Foco') return low.includes('foco');
    if (tab == 'Relaxar') return low.includes('respiro') || low.includes('relax');
    if (tab == 'Dormir') return low.includes('sono') || low.includes('noite');
    return true;
  });

  const currentTrack = meditacoes.find(t => t.id == activeTrackId);

  return(
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{padding: 20}}>

          {/* titulo e subtitulo */}
          <View className="mt-8">
            <Text className="text-primary font-bold text-6xl">Meditar</Text>
            <Text className="text-primary mt-1 text-lg font-medium">Pronto para relaxar um pouco?</Text>
          </View>

          {/* abas de categorias das musicas */}
          <View className="mt-8">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TABS.map(t => (
                <CategoryTab key={t.label} label={t.label} icon={t.icon} isActive={tab === t.label} onPress={()=> setTab(t.label)}/>
              ))}
            </ScrollView>
          </View>
          
          {/* spin de carregamento quando "puxa" a música */}
          {carregando && (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator size="large" color="#081126"/>
              <Text className="mt-4 font-bold text-lg">Carregando...</Text>
            </View>
          )}    

          {erro && !carregando && (
            <View className="bg-surface-card rounded-3xl p-5 items-center">
              <Ionicons name="cloud-offline-outline" size={32} color="#081126" />
              <Text className="text-status-alert font-bold mt-2">{erro}</Text>
            </View>
          )}

          {!carregando && !erro && (
            <>
              {tab === 'Ambiente' ? (
                <View>
                  <Text className="font-bold text-xl mb-1" >Sons ambientes</Text>
                  <Text className="text-sm mb-6">Pode juntar os sons!</Text>
                  <View className="flex-row flex-wrap justify-between">
                    {ambientSound.map(s => (
                      <AmbientSoundCard key={s.id} label={s.title} icon={getIconAmbient(s.title)} isActive={activeSoundIds.has(s.id)} isLoading={loadingSoundIds.has(s.id)} onPress={()=>tunrOnOrOffAmbient(s)}/>
                    ))}
                  </View>
                </View>
              ): (
                <View>
                  {filterCategory.length === 0 ? (
                    <View className="bg-background rounded p-5 items-center">
                      <Ionicons name="musical-notes-outline" size={32} color="#ea7a53"/>
                      <Text className="text-primary mt-2">Ainda não temos disponível para essa categoria.</Text>
                    </View>
                  ) : (
                    filterCategory.map(t => (
                      <TrackCard key={t.id} title={t.title} subtitle="TiredNess" duration={formatTime(t.duration)} isPlaying={activeTrackId === t.id && isPlaying} isBuffering={activeTrackId === t.id && isBuffering} onPress={() => playTrack(t)}/>
                    ))
                  )}
                </View>
              )}
            </>
          )}


          {currentTrack && (
            <View className="absolute bottom-5 left-5 right-5 z-50">
              <TrackCard title={currentTrack.title} subtitle="Tocando" duration={formatTime(currentTrack.duration)} isPlaying={isPlaying} isBuffering={isBuffering}  onPress={()=>playTrack(currentTrack)}/>
            </View>
          )}
        </ScrollView> 
      </View>
    </SafeAreaView>
  )

}