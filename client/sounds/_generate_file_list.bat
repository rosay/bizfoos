del _tmp_sound_file_list.txt
FOR %%c in (*.wav;*.mp3;*.ogg) DO echo "%%c", >> _tmp_sound_file_list.txt
sort _tmp_sound_file_list.txt > _generated_sound_file_list.txt
del _tmp_sound_file_list.txt