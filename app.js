// =====================================================================
// app.js  v2.0 — i18n + UI refresh
// =====================================================================

// --- Demo mode ---
const IS_DEMO = new URLSearchParams(window.location.search).has('demo');
const DEMO_YOUTUBE_ID = '8ZhxpGVlk4o';
const DEMO_DVW = `[3DATAVOLLEYSCOUT]
FILEFORMAT: 2.0
[3MATCH]
08/10/2024;11.00.00;2015/2016;;;;;526302;;1;;Z;
;;;;;;;;
[3TEAMS]
FRA;France National Team (Men's);3;;;;
POL;Poland National Team (Men's);0;;;;
[3MORE]
;;;;;VolleyMetrics;
;;;
[3COMMENTS]
;;;;
[3SET]
True;8-6;16-11;21-16;25-19;25;
True;6-8;15-16;21-19;25-20;25;
True;8-7;14-16;21-18;25-23;25;
True;;;;;25;
True;;;;;15;
[3PLAYERS-H]
0;1;1;2;2;2;;;-390554;Chinenyeze;Barthelemy;Chinenyeze;;;False;;;
0;2;2;*;*;*;;;-390555;Grebennikov;Jenia;Grebennikov;L;1;False;;;
0;4;4;3;3;3;;;-55008;Patry;Jean;Patry;;;False;;;
0;9;9;1;1;1;;;-390559;N'Gapeth;Earvin;N'Gapeth;;;False;;;
0;11;11;6;6;6;;;-390560;Brizard;Antoine;Brizard;;;False;;;
0;14;14;5;5;5;;;12021;Le Goff;Nicolas le;Le Goff;;;False;;;
0;17;17;4;4;4;;;12010;Clevenot;Trevor;Clevenot;;;False;;;
[3PLAYERS-V]
1;6;38;3;3;3;;;12143;Kurek;Bartosz;Kurek;;;False;;;
1;9;41;4;4;4;;;-279128;Wilfredo;Leon;Wilfredo;;;False;;;
1;15;46;5;5;5;;;-74585;Kochanowski;Jakub;Kochanowski;;;False;;;
1;17;48;*;*;*;;;12170;Zatorski;Pawel;Zatorski;L;1;False;;;
1;19;50;6;6;6;;;-206639;Janusz;Marcin;Janusz;;;False;;;
1;21;52;1;1;1;;;-206642;Fornal;Tomasz;Fornal;;;False;;;
1;99;76;2;2;2;;;-279134;Norbert;Huber;Norbert;;;False;;;
[3ATTACKCOMBINATION]
[3SETTERCALL]
K1;;Quick ahead;;16711680;3949;4549;4949;;12632256;
KM;;Push;;16711680;3949;3949;4949;6226,5026,5037,6237,;12632256;
K2;;Quick behind;;16711680;3864;4278;4974;;255;
[3WINNINGSYMBOLS]
=~~~#~~~=~~~~~~~=/~~#~~~=/~~#~~~~~~~~~~~=/~~~~~~=~~~~~~~
[3RESERVE]
[3SCOUT]
*P11>LUp;;;;;;;;1;6;6;1;739;;9;1;4;17;14;11;21;99;6;9;15;19;
*z6>LUp;;;;;;;;1;6;6;1;739;;9;1;4;17;14;11;21;99;6;9;15;19;
aP19>LUp;;;;;;;;1;6;6;1;739;;9;1;4;17;14;11;21;99;6;9;15;19;
az6>LUp;;;;;;;;1;6;6;1;739;;9;1;4;17;14;11;21;99;6;9;15;19;
*09SQ=~~~11D~~~00;;;;0583;-1-1;9735;;1;6;6;1;739;;9;1;4;17;14;11;21;99;6;9;15;19;
ap00:01;;;;0365;-1-1;;;1;6;6;1;740;;9;1;4;17;14;11;21;99;6;9;15;19;
aP19;;;;;;;;1;6;5;1;757;;9;1;4;17;14;11;99;6;9;15;19;21;
az5;;;;;;;;1;6;5;1;757;;9;1;4;17;14;11;99;6;9;15;19;21;
*P11;;;;;;;;1;6;5;1;757;;9;1;4;17;14;11;99;6;9;15;19;21;
*z6;;;;;;;;1;6;5;1;757;;9;1;4;17;14;11;99;6;9;15;19;21;
a99SQ-~~~19D~~~+1;;;;0383;-1-1;7234;;1;6;5;1;757;;9;1;4;17;14;11;99;6;9;15;19;21;
*09RQ#~~~19DR~~-1B;;;;0383;-1-1;7234;;1;6;5;1;758;;9;1;4;17;14;11;99;6;9;15;19;21;
*11ET#KMB~3A~~~-1;;;;4360;-1-1;-1-1;;1;6;5;1;759;;9;1;4;17;14;11;99;6;9;15;19;21;
*04AT#X6~24DT2~-1F;;;;4285;-1-1;5787;;1;6;5;1;760;;9;1;4;17;14;11;99;6;9;15;19;21;
*p01:01;;;;4313;-1-1;;;1;6;5;1;761;;9;1;4;17;14;11;99;6;9;15;19;21;
*P11;;;;;;;;1;5;5;1;782;;1;4;17;14;11;9;99;6;9;15;19;21;
*z5;;;;;;;;1;5;5;1;782;;1;4;17;14;11;9;99;6;9;15;19;21;
aP19;;;;;;;;1;5;5;1;782;;1;4;17;14;11;9;99;6;9;15;19;21;
az5;;;;;;;;1;5;5;1;782;;1;4;17;14;11;9;99;6;9;15;19;21;
*01SM!~~~57A~~~00;;;;0516;-1-1;7374;;1;5;5;1;782;;1;4;17;14;11;9;99;6;9;15;19;21;
a21RM!~~~57AO~~00B;;;;0516;-1-1;7374;;1;5;5;1;783;;1;4;17;14;11;9;99;6;9;15;19;21;
a19ET#K1B~3D~~~00;;;;4344;-1-1;-1-1;;1;5;5;1;784;;1;4;17;14;11;9;99;6;9;15;19;21;
a06AT+X6~25BT2~00F;;;;4284;5380;7869;;1;5;5;1;785;;1;4;17;14;11;9;99;6;9;15;19;21;
*14BT/~~~~4B~~~00;;;;4720;-1-1;-1-1;;1;5;5;1;786;;1;4;17;14;11;9;99;6;9;15;19;21;
a15DT#~~~23AC~~00F;;;;5816;4720;5744;;1;5;5;1;787;;1;4;17;14;11;9;99;6;9;15;19;21;
a19ET#K1B~2D~~~00;;;;4264;-1-1;-1-1;;1;5;5;1;788;;1;4;17;14;11;9;99;6;9;15;19;21;
a06AT#X6~26CH2~00F;;;;4486;5377;8053;;1;5;5;1;790;;1;4;17;14;11;9;99;6;9;15;19;21;
*14BT=~~~~4B~~~00;;;;4723;-1-1;-1-1;;1;5;5;1;790;;1;4;17;14;11;9;99;6;9;15;19;21;
ap01:02;;;;1488;-1-1;;;1;5;5;1;791;;1;4;17;14;11;9;99;6;9;15;19;21;
aP19;;;;;;;;1;5;4;1;815;;1;4;17;14;11;9;6;9;15;19;21;99;
az4;;;;;;;;1;5;4;1;815;;1;4;17;14;11;9;6;9;15;19;21;99;
*P11;;;;;;;;1;5;4;1;815;;1;4;17;14;11;9;6;9;15;19;21;99;
*z5;;;;;;;;1;5;4;1;815;;1;4;17;14;11;9;6;9;15;19;21;99;
a06SQ=~~~92C~~~+1;;;;0460;-1-1;4767;;1;5;4;1;815;;1;4;17;14;11;9;6;9;15;19;21;99;
*p02:02;;;;4767;-1-1;;;1;5;4;1;816;;1;4;17;14;11;9;6;9;15;19;21;99;
*P11;;;;;;;;1;4;4;1;831;;4;17;14;11;9;1;6;9;15;19;21;99;
*z4;;;;;;;;1;4;4;1;831;;4;17;14;11;9;1;6;9;15;19;21;99;
aP19;;;;;;;;1;4;4;1;831;;4;17;14;11;9;1;6;9;15;19;21;99;
az4;;;;;;;;1;4;4;1;831;;4;17;14;11;9;1;6;9;15;19;21;99;
*04SQ=~~~96D~~~00;;;;0570;-1-1;9954;;1;4;4;1;831;;4;17;14;11;9;1;6;9;15;19;21;99;
ap02:03;;;;0146;-1-1;;;1;4;4;1;832;;4;17;14;11;9;1;6;9;15;19;21;99;
aP19;;;;;;;;1;4;3;1;856;;4;17;14;11;9;1;9;15;19;21;99;6;
az3;;;;;;;;1;4;3;1;856;;4;17;14;11;9;1;9;15;19;21;99;6;
*P11;;;;;;;;1;4;3;1;856;;4;17;14;11;9;1;9;15;19;21;99;6;
*z4;;;;;;;;1;4;3;1;856;;4;17;14;11;9;1;9;15;19;21;99;6;
a09SQ/~~~15B~~~+1;;;;0582;-1-1;8165;;1;4;3;1;856;;4;17;14;11;9;1;9;15;19;21;99;6;
*09RQ/~~~15BL~~-1B;;;;0582;-1-1;8165;;1;4;3;1;857;;4;17;14;11;9;1;9;15;19;21;99;6;
a09FH#~~~56B~~~+1B;;;;1935;;8044;;1;4;3;1;859;;4;17;14;11;9;1;9;15;19;21;99;6;
a19EM#K1P~3B~~~+1;;;;4460;-1-1;-1-1;;1;4;3;1;860;;4;17;14;11;9;1;9;15;19;21;99;6;
a09AM-XP~89DP4~+1B;;;;3044;-1-1;7535;;1;4;3;1;861;;4;17;14;11;9;1;9;15;19;21;99;6;
*04DM#~~~89DS~~-1B;;;;3044;-1-1;7535;;1;4;3;1;862;;4;17;14;11;9;1;9;15;19;21;99;6;
*11ET#K1B~8B~~~-1;;;;3551;-1-1;-1-1;;1;4;3;1;864;;4;17;14;11;9;1;9;15;19;21;99;6;
*04AT#X8~95BH2~-1B;;;;3283;-1-1;7881;;1;4;3;1;865;;4;17;14;11;9;1;9;15;19;21;99;6;
a17DT=~~~95BS~~+1B;;;;3283;-1-1;7881;;1;4;3;1;865;;4;17;14;11;9;1;9;15;19;21;99;6;
*p03:03;;;;3017;-1-1;;;1;4;3;1;866;;4;17;14;11;9;1;9;15;19;21;99;6;
*P11;;;;;;;;1;3;3;1;887;;17;14;11;9;1;4;9;15;19;21;99;6;
*z3;;;;;;;;1;3;3;1;887;;17;14;11;9;1;4;9;15;19;21;99;6;
aP19;;;;;;;;1;3;3;1;887;;17;14;11;9;1;4;9;15;19;21;99;6;
az3;;;;;;;;1;3;3;1;887;;17;14;11;9;1;4;9;15;19;21;99;6;
*17SQ!~~~69D~~~00;;;;0551;-1-1;7630;;1;3;3;1;887;;17;14;11;9;1;4;9;15;19;21;99;6;
a09RQ!~~~69DO~~00B;;;;0551;-1-1;7630;;1;3;3;1;888;;17;14;11;9;1;4;9;15;19;21;99;6;
a19ET#K1B~2C~~~00;;;;4471;-1-1;-1-1;;1;3;3;1;889;;17;14;11;9;1;4;9;15;19;21;99;6;
a06AT#X8~97BH2~00B;;;;3188;5385;6779;;1;3;3;1;890;;17;14;11;9;1;4;9;15;19;21;99;6;
*09BT=~~~~4C~~~00;;;;4715;-1-1;-1-1;;1;3;3;1;890;;17;14;11;9;1;4;9;15;19;21;99;6;
ap03:04;;;;3815;-1-1;;;1;3;3;1;891;;17;14;11;9;1;4;9;15;19;21;99;6;`;

// --- 0. i18n (Internationalization) ---
const i18n = {
    en: {
        select_match: "Select Match...",
        add_match: "Add Match",
        delete_match: "Delete match",
        logout: "Logout",
        rallies: "Rallies",
        individual: "Individual",
        table: "Table",
        rotation: "Rotation",
        server_team: "1. Server Team",
        both_teams: "Both Teams",
        filter_team: "1. Team",
        select_team: "Select Team",
        filter_player: "2. Player",
        all_players: "All Players",
        filter_skill: "3. Skill",
        filter_effect: "4. Effect",
        all: "All",
        search_comments: "Search Comments / Tags",
        search_placeholder: "Keyword (e.g. #MB, #Good)",
        copy_url: "Copy URL",
        share_list: "Share List",
        auto_skip: "Auto-Skip",
        add_new_match: "Add New Match",
        category: "Category",
        cat_placeholder: "Select or type new category",
        edit_category: "Edit Category",
        edit_category_prompt: "Enter new category name:",
        edit_category_success: "Category updated!",
        edit_category_fail: "Failed to update category.",
        dvw_file: "DVW File",
        choose_file: "Choose File",
        no_file: "No file selected",
        upload_save: "Upload & Save",
        shortcuts: "Keyboard Shortcuts",
        sc_next_prev: "Next / Prev",
        sc_repeat: "Repeat",
        sc_seek: "-2s / +2s",
        sc_draw: "Draw On/Save",
        sc_undo: "Undo Draw",
        sc_note: "Focus Note",
        sc_submit: "Submit",
        sc_tag: "Select Tag",
        close: "Close",
        undo: "Undo",
        clear: "Clear",
        cancel: "Cancel",
        save_draw: "Save (P)",
        no_plays: "No plays found.",
        analyzing: "Analyzing file...",
        file_error: "File load error.",
        no_matches: "No matches",
        no_categories: "No Categories",
        select_team_msg: "Please select a team to view player stats",
        no_data_msg: "No match data yet for this team.\nAdd one with \"+ Add Match\".",
        confirm_logout: "Log out?",
        confirm_delete_comment: "Delete this?",
        comment_save_fail: "Failed to save comment. Please try again.",
        comment_delete_fail: "Failed to delete comment. Please try again.",
        drawing_save_fail: "Failed to save drawing. Please try again.",
        upload_all_required: "Please fill in all fields",
        invalid_youtube_url: "Could not read the YouTube URL. Please check it and try again.",
        upload_success: "Match added successfully!",
        upload_fail: "Failed to add match.",
        uploading: "Uploading...",
        delete_confirm_prompt: "This will permanently delete this match.\n\nTarget: \"{name}\"\n\nAll comments and drawings will also be deleted.\nType \"DELETE\" to confirm.",
        deleted: "Deleted.",
        delete_fail: "Failed to delete: ",
        link_copied: "Link copied!",
        playlist_copied: "{n} plays playlist URL copied!",
        copy_fail: "Copy failed: ",
        no_plays_to_share: "No plays in list to share.",
        login_title: "Sync Scout",
        login_sub: "Log in with your team passcode",
        login_team_id: "Team ID",
        login_team_placeholder: "e.g. blue-tiger",
        login_pass: "Passcode",
        login_pass_placeholder: "Your team passcode",
        login_btn: "Log In",
        login_checking: "Checking...",
        login_required: "Please enter team ID and passcode",
        login_expired: "License expired.",
        login_expired_upgrade_link: "Upgrade now",
        login_invalid: "Team ID or passcode is incorrect.",
        login_admin_link: "Team admin? Go to the admin console",
        login_upgrade_link: "On a free trial? Upgrade here",
        comment_protected: "This comment is protected by the team admin and cannot be deleted.",
        note_placeholder: "Note...",
        send: "Send",
        draw_label: "Draw",
        note_label: "Note",
        copy_link: "Copy Link",
        share_play: "Share",
        share_line: "LINE",
        share_whatsapp: "WhatsApp",
        save_playlist: "Save List",
        playlist_name_prompt: "Playlist name:",
        playlist_saved: "Playlist saved!",
        playlist_save_fail: "Failed to save playlist.",
        playlist_deleted: "Playlist deleted.",
        playlist_select: "Playlists",
        playlist_none: "No saved playlists",
        new_comments: "{n} new comment(s)",
        serves: " Serves",
        stats_label: " Stats",
        rotation_label: " Rotation",
        player_col: "Player",
        change_passcode: "Change Passcode",
        cp_title: "Change Passcode",
        cp_current: "Current passcode",
        cp_new: "New passcode",
        cp_confirm: "Confirm new passcode",
        cp_btn: "Change",
        cp_changing: "Changing...",
        cp_mismatch: "New passcodes do not match.",
        cp_short: "Passcode must be at least 4 characters.",
        cp_success: "Passcode changed! Please share the new passcode with your team.",
        cp_fail: "Current passcode is incorrect.",
        manage_tags: "Manage Tags",
        mt_title: "Manage Tags",
        mt_desc: "Edit the hashtags your team uses when tagging plays.",
        mt_add_placeholder: "New tag (e.g. #Serve)",
        mt_add_btn: "Add",
        mt_save: "Save",
        mt_reset: "Reset to Default",
        mt_save_success: "Tags saved!",
        mt_save_fail: "Failed to save tags.",
        mt_empty: "Add at least one tag.",
        mt_duplicate: "That tag already exists.",
        highlight_only: "Highlights Only",
        highlight_badge: "Highlight",
        highlight_settings: "Highlight Settings",
        hl_title: "Highlight Settings",
        hl_desc: "Configure how highlights are detected in match footage.",
        hl_rally_sec_label: "Rally duration (seconds or more)",
        hl_score_section_label: "Close-score condition",
        hl_min_points_label: "Combined score (points or more)",
        hl_max_diff_label: "Point difference (within)",
        hl_scope_break: "Breaks only (point scored on own serve)",
        hl_scope_all: "All rallies",
    },
    ja: {
        select_match: "試合を選択...",
        add_match: "試合追加",
        delete_match: "試合を削除",
        logout: "ログアウト",
        rallies: "ラリー",
        individual: "個人",
        table: "統計",
        rotation: "ローテ",
        server_team: "1. サーブチーム",
        both_teams: "両チーム",
        filter_team: "1. チーム",
        select_team: "チーム選択",
        filter_player: "2. 選手",
        all_players: "全選手",
        filter_skill: "3. スキル",
        filter_effect: "4. 評価",
        all: "全て",
        search_comments: "コメント・タグ検索",
        search_placeholder: "キーワード（例: #MB, #Good）",
        copy_url: "URLコピー",
        share_list: "リスト共有",
        auto_skip: "自動スキップ",
        add_new_match: "新しい試合を追加",
        category: "カテゴリ",
        cat_placeholder: "カテゴリを選択または入力",
        edit_category: "カテゴリ変更",
        edit_category_prompt: "新しいカテゴリ名を入力:",
        edit_category_success: "カテゴリを変更しました！",
        edit_category_fail: "カテゴリの変更に失敗しました。",
        dvw_file: "DVWファイル",
        choose_file: "ファイルを選択",
        no_file: "ファイルが選択されていません",
        upload_save: "アップロード & 保存",
        shortcuts: "キーボードショートカット",
        sc_next_prev: "次 / 前",
        sc_repeat: "リプレイ",
        sc_seek: "-2秒 / +2秒",
        sc_draw: "描画 開始/保存",
        sc_undo: "描画 元に戻す",
        sc_note: "ノート フォーカス",
        sc_submit: "送信",
        sc_tag: "タグ選択",
        close: "閉じる",
        undo: "元に戻す",
        clear: "クリア",
        cancel: "キャンセル",
        save_draw: "保存 (P)",
        no_plays: "プレーが見つかりません。",
        analyzing: "ファイル解析中...",
        file_error: "ファイル読み込みエラー。",
        no_matches: "試合なし",
        no_categories: "カテゴリなし",
        select_team_msg: "チームを選択してください",
        no_data_msg: "まだ試合データがありません。\n「＋ 試合追加」から追加してください。",
        confirm_logout: "ログアウトしますか？",
        change_passcode: "パスコード変更",
        cp_title: "パスコード変更",
        cp_current: "現在のパスコード",
        cp_new: "新しいパスコード",
        cp_confirm: "新しいパスコード（確認）",
        cp_btn: "変更する",
        cp_changing: "変更中...",
        cp_mismatch: "新しいパスコードが一致しません。",
        cp_short: "パスコードは4文字以上にしてください。",
        cp_success: "パスコードを変更しました！チームメンバーに新しいパスコードを共有してください。",
        cp_fail: "現在のパスコードが正しくありません。",
        manage_tags: "タグ管理",
        mt_title: "タグ管理",
        mt_desc: "プレーにタグ付けする際に使うハッシュタグを編集できます。",
        mt_add_placeholder: "新しいタグ（例: #Serve）",
        mt_add_btn: "追加",
        mt_save: "保存",
        mt_reset: "初期設定に戻す",
        mt_save_success: "タグを保存しました！",
        mt_save_fail: "タグの保存に失敗しました。",
        mt_empty: "タグを1つ以上追加してください。",
        mt_duplicate: "そのタグは既に登録されています。",
        highlight_only: "ハイライトのみ",
        highlight_badge: "ハイライト",
        highlight_settings: "ハイライト設定",
        hl_title: "ハイライト設定",
        hl_desc: "試合映像からハイライトを検出する条件を設定します。",
        hl_rally_sec_label: "○○秒以上のラリー",
        hl_score_section_label: "接戦条件",
        hl_min_points_label: "○○点以上",
        hl_max_diff_label: "○○点差以内",
        hl_scope_break: "ブレイク（自サーブ時の得点）のみ",
        hl_scope_all: "すべてのラリー",
        confirm_delete_comment: "削除しますか？",
        comment_save_fail: "コメントの保存に失敗しました。もう一度お試しください。",
        comment_delete_fail: "コメントの削除に失敗しました。もう一度お試しください。",
        drawing_save_fail: "描画の保存に失敗しました。もう一度お試しください。",
        upload_all_required: "全て入力してください",
        invalid_youtube_url: "YouTubeのURLを読み取れませんでした。URLを確認してください。",
        upload_success: "追加しました！",
        upload_fail: "追加に失敗しました。",
        uploading: "アップロード中...",
        delete_confirm_prompt: "この試合を完全に削除します。\n\n対象: 「{name}」\n\nコメント・描画データも全て削除されます。\n確認のため「DELETE」と入力してください。",
        deleted: "削除しました。",
        delete_fail: "削除に失敗しました: ",
        link_copied: "リンクをコピーしました！",
        playlist_copied: "{n}件のプレイリストURLをコピーしました！",
        copy_fail: "コピーに失敗しました: ",
        no_plays_to_share: "共有するプレーがリストにありません。",
        login_title: "Sync Scout",
        login_sub: "チームの合言葉でログイン",
        login_team_id: "チームID",
        login_team_placeholder: "例: blue-tiger",
        login_pass: "合言葉",
        login_pass_placeholder: "チームの合言葉",
        login_btn: "ログイン",
        login_checking: "確認中…",
        login_required: "チームIDと合言葉を入力してください",
        login_expired: "ライセンスの有効期限が切れています。",
        login_expired_upgrade_link: "今すぐアップグレード",
        login_invalid: "チームIDまたは合言葉が違います。",
        login_admin_link: "チーム管理者の方はこちら（管理者ページへ）",
        login_upgrade_link: "トライアル中の方はこちら（アップグレード）",
        comment_protected: "このコメントは管理者によって保護されているため削除できません。",
        note_placeholder: "ノート...",
        send: "送信",
        draw_label: "描画",
        note_label: "ノート",
        copy_link: "リンクコピー",
        share_play: "共有",
        share_line: "LINE",
        share_whatsapp: "WhatsApp",
        save_playlist: "リスト保存",
        playlist_name_prompt: "プレイリスト名:",
        playlist_saved: "プレイリストを保存しました！",
        playlist_save_fail: "保存に失敗しました。",
        playlist_deleted: "プレイリストを削除しました。",
        playlist_select: "プレイリスト",
        playlist_none: "保存済みプレイリストなし",
        new_comments: "新着コメント {n} 件",
        serves: " サーブ",
        stats_label: " 統計",
        rotation_label: " ローテ",
        player_col: "選手",
    }
};

let currentLang = localStorage.getItem('syncscout_lang') || 'en';

function t(key, replacements) {
    let str = (i18n[currentLang] && i18n[currentLang][key]) || (i18n.en[key]) || key;
    if (replacements) {
        Object.keys(replacements).forEach(k => { str = str.replace(`{${k}}`, replacements[k]); });
    }
    return str;
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.dataset.i18nTitle);
    });
    const langLabel = document.getElementById('lang-label');
    if (langLabel) langLabel.textContent = currentLang === 'en' ? 'EN' : 'JA';
    const langMenuLabel = document.getElementById('lang-menu-label');
    if (langMenuLabel) langMenuLabel.textContent = currentLang === 'en' ? 'English → 日本語' : '日本語 → English';
}

function toggleLang() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    localStorage.setItem('syncscout_lang', currentLang);
    applyI18n();
    if (allPlays.length > 0 || rallies.length > 0) render();
}

function hideAllTagPopups() { document.querySelectorAll('.tag-popup').forEach(p => p.classList.remove('show')); }

// --- Unified App Menu ---
function toggleAppMenu() {
    const menu = document.getElementById('app-menu');
    if (menu) menu.classList.toggle('show');
}
document.addEventListener('click', (e) => {
    const menu = document.getElementById('app-menu');
    const btn = document.querySelector('.menu-toggle-btn');
    if (menu && menu.classList.contains('show') && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        menu.classList.remove('show');
    }
});

// --- 1. Supabase 設定 (HTH 単一チーム・認証なし版) ---
const SUPABASE_URL = 'https://mqkoahmpuqjttlpubeoo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa29haG1wdXFqdHRscHViZW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDUyMDQsImV4cCI6MjA4OTQ4MTIwNH0.iIsfV5Cf_rPApNACbMvFVCiPZrLVDeGOYRB4op-0KCI';

const MY_TEAM_CODE = 'HTH';
const MY_TEAM_ID = null;
const MY_TEAM_SLUG = 'hth';
const MY_TEAM_NAME = 'HTH';
let supabaseClient;

async function checkAuth() {
    loadHighlightConfig();

    const badge = document.getElementById('team-badge');
    if (badge) {
        badge.innerText = MY_TEAM_NAME;
        badge.style.display = 'inline-flex';
    }

    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    await loadTeamTags();

    applyI18n();

    if (window.YT && window.YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }
}

// --- 2. グローバル変数 & YouTube 初期化 ---
function getSafeURLParams() {
    const params = new URLSearchParams(window.location.search);
    let q = params.get('q');
    let ids = params.get('ids');
    const href = window.location.href;

    if (!ids && href.includes('ids=')) {
        ids = href.split('ids=')[1].split('&')[0];
    }
    if (!q) {
        if (href.includes('q=#')) q = '#' + href.split('q=#')[1].split('&')[0];
        else if (href.includes('q=%23')) q = '#' + href.split('q=%23')[1].split('&')[0];
    }

    const matchParam = params.get('match') || (href.includes('match=') ? href.split('match=')[1].split('&')[0] : null);

    return {
        match: matchParam,
        t: params.get('t'),
        q: q ? decodeURIComponent(q) : null,
        ids: ids ? decodeURIComponent(ids) : null
    };
}
const urlParams = getSafeURLParams();
window.initLinkData = { t: urlParams.t, q: urlParams.q, match: urlParams.match, ids: urlParams.ids };

let player, allPlays = [], rallies = [], matchMap = {}, playerMaster = {}, allMatchData = [], currentData = [];
let currentMode = 'rally', currentIndex = -1, checkInterval;
let currentMatchDVW = "", currentCategory = "All", matchComments = {}, matchDrawings = {};
let showHighlightOnly = false;
const HIGHLIGHT_CONFIG = { minRallySec: 15, breakMinTotalPoints: 40, breakMaxDiff: 2, setsToWin: 3, breakOnly: true, enableRallySec: true, enableCloseScore: true };
function loadHighlightConfig() {
    try {
        const raw = localStorage.getItem(`ss_highlight_config_${MY_TEAM_CODE}`);
        if (raw) Object.assign(HIGHLIGHT_CONFIG, JSON.parse(raw));
    } catch (e) {}
}
const DEFAULT_TAGS = ["#MB","#OH","#OP","#S","#L","#Good","#Bad","#System","#Transition","#BlockDefense","#Check"];
let starterTags = [...DEFAULT_TAGS];

async function loadTeamTags() {
    if (IS_DEMO || !supabaseClient) return;
    try {
        const { data, error } = await supabaseClient.from('team_tags').select('tags').limit(1).maybeSingle();
        if (!error && data && Array.isArray(data.tags) && data.tags.length) {
            starterTags = data.tags;
        }
    } catch (e) { /* keep defaults on failure */ }
}

function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function jsAttr(val) {
    return JSON.stringify(String(val)).replace(/"/g, '&quot;');
}

function extractYouTubeId(url) {
    url = String(url).trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    const patterns = [
        /[?&]v=([A-Za-z0-9_-]{11})/,
        /youtu\.be\/([A-Za-z0-9_-]{11})/,
        /\/embed\/([A-Za-z0-9_-]{11})/,
        /\/live\/([A-Za-z0-9_-]{11})/,
        /\/shorts\/([A-Za-z0-9_-]{11})/,
    ];
    for (const re of patterns) {
        const m = url.match(re);
        if (m) return m[1];
    }
    return null;
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height:'100%', width:'100%',
        playerVars:{'playsinline':1,'rel':0,'modestbranding':1,'controls':0},
        events:{ 'onReady': () => { initTelestrator(); fetchMatchList(); }, 'onStateChange': onPlayerStateChange }
    });
}

function onPlayerStateChange(e) {
    const autoNextCb = document.getElementById('autoNext');
    if (e.data == 1 && autoNextCb && autoNextCb.checked) startTracking();
    else clearInterval(checkInterval);
}

function startTracking() {
    clearInterval(checkInterval);
    checkInterval = setInterval(() => {
        if (currentIndex >= 0 && currentData[currentIndex]) {
            const now = player.getCurrentTime(), d = currentData[currentIndex];
            let limit = (currentMode === 'player') ? d.endTime : (d.rallyEndTime || (d.startTime + 7.0)) + 2.0;
            if (now > limit && currentIndex < currentData.length - 1) playNext();
        }
    }, 500);
}


// --- 3. データ取得・保存 (チーム隔離対応) ---
function fetchMatchList() {
    if (IS_DEMO) {
        allMatchData = [{ cat: 'Demo', dvw: 'demo:FRA-POL', vid: DEMO_YOUTUBE_ID, display_name: 'FRA vs POL (Paris 2024)' }];
        matchMap['demo:FRA-POL'] = DEMO_YOUTUBE_ID;
        renderCategoryTabs(['All', 'Demo']); updateMatchDropdown();
        currentMatchDVW = 'demo:FRA-POL';
        player.loadVideoById(DEMO_YOUTUBE_ID);
        document.getElementById('matchSelect').value = 'demo:FRA-POL';
        parseDVW(DEMO_DVW);
        return;
    }
    supabaseClient.from('matches').select('*').order('created_at', { ascending: false })
    .then(dbRes => {
        allMatchData = []; let cats = new Set(["All"]);
        if(dbRes.error) {
            console.error("Match fetch error:", dbRes.error);
            document.getElementById('instanceList').innerHTML = `<div class="empty-msg">Error: ${escapeHtml(dbRes.error.message)}</div>`;
            return;
        }
        if(dbRes.data && dbRes.data.length > 0) {
            dbRes.data.forEach(m => { allMatchData.push({ cat: m.category, dvw: m.dvw_url, vid: m.youtube_id, display_name: m.dvw_filename }); cats.add(m.category); });
        }
        renderCategoryTabs(Array.from(cats)); updateMatchDropdown();

        const mParam = window.initLinkData.match || urlParams.match;
        if (mParam && matchMap[mParam]) { document.getElementById('matchSelect').value = mParam; onMatchChange(mParam); }
        else if (allMatchData.length > 0) { onMatchChange(allMatchData[0].dvw); document.getElementById('matchSelect').value = allMatchData[0].dvw; }
        else { document.getElementById('instanceList').innerHTML = `<div class="empty-msg">${t('no_data_msg')}</div>`; }
    });
}

let catList = [];

function renderCategoryTabs(cats) {
    catList = cats;
    const label = document.getElementById('catCurrentLabel');
    if (label) label.textContent = currentCategory;

    const list = document.getElementById('catDropdownList');
    if (!list) return;
    list.innerHTML = '';
    cats.forEach(c => {
        const btn = document.createElement('button');
        btn.className = `cat-dropdown-item${c === currentCategory ? ' active' : ''}`;
        btn.textContent = c;
        btn.onclick = (e) => { e.stopPropagation(); currentCategory = c; renderCategoryTabs(cats); updateMatchDropdown(); closeCatDropdown(); };
        list.appendChild(btn);
    });

    const datalist = document.getElementById('existing-cats');
    if (datalist) {
        datalist.innerHTML = '';
        cats.filter(c => c !== 'All').forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            datalist.appendChild(opt);
        });
    }
}

function toggleCatDropdown() {
    const list = document.getElementById('catDropdownList');
    if (list) list.classList.toggle('show');
}
function closeCatDropdown() {
    const list = document.getElementById('catDropdownList');
    if (list) list.classList.remove('show');
}
document.addEventListener('click', (e) => {
    const wrap = document.getElementById('catDropdownWrap');
    if (wrap && !wrap.contains(e.target)) closeCatDropdown();
});

function updateMatchDropdown() {
    const select = document.getElementById('matchSelect'); if(!select) return;
    select.innerHTML = `<option value="">${t('select_match')}</option>`; matchMap = {};
    const filtered = allMatchData.filter(m => currentCategory === "All" || m.cat === currentCategory);
    if(filtered.length === 0) { select.innerHTML = `<option value="">${t('no_matches')}</option>`; select.disabled = true; }
    else { select.disabled = false; filtered.forEach(m => { matchMap[m.dvw] = m.vid; let name = m.display_name ? m.display_name : m.dvw.split('/').pop().replace('.dvw',''); select.add(new Option(name, m.dvw)); }); }
}

function updateFileName() {
    const input = document.getElementById('am-file');
    const span = document.getElementById('am-file-name');
    if (!input || !span) return;
    if (input.files.length) {
        span.removeAttribute('data-i18n');
        span.textContent = input.files[0].name;
    } else {
        span.setAttribute('data-i18n', 'no_file');
        span.textContent = t('no_file');
    }
}

function toggleShortcuts() {
    const modal = document.getElementById('shortcut-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
}

async function submitNewMatch() {
    const cat = document.getElementById('am-cat').value.trim();
    const ytUrl = document.getElementById('am-yt').value.trim();
    const fileInput = document.getElementById('am-file');

    if(!cat || !ytUrl || !fileInput.files.length) return alert(t('upload_all_required'));

    const ytId = extractYouTubeId(ytUrl);
    if (!ytId) return alert(t('invalid_youtube_url'));

    const file = fileInput.files[0];
    const fileName = Date.now() + "_" + file.name;
    const btn = document.getElementById('am-submit-btn');
    btn.innerText = t('uploading'); btn.disabled = true;

    try {
        const { error: uploadError } = await supabaseClient.storage.from('dvw_files').upload(fileName, file);
        if (uploadError) throw new Error("Storage Upload Error: " + uploadError.message);

        const { data: urlData } = supabaseClient.storage.from('dvw_files').getPublicUrl(fileName);

        const { error: dbError } = await supabaseClient.from('matches').insert([{
            category: cat,
            dvw_filename: file.name,
            dvw_url: urlData.publicUrl,
            youtube_id: ytId
        }]);
        if(dbError) throw new Error("DB Insert Error: " + dbError.message);

        alert(t('upload_success'));
        document.getElementById('add-match-modal').style.display = 'none';
        document.getElementById('am-cat').value = '';
        document.getElementById('am-yt').value = '';
        document.getElementById('am-file').value = '';
        updateFileName();
        fetchMatchList();
    } catch(e) {
        console.error(e); alert(t('upload_fail') + "\n\n" + e.message);
    } finally {
        btn.innerText = t('upload_save'); btn.disabled = false;
    }
}

function onMatchChange(dvw) {
    const delBtn = document.getElementById('menu-delete-match');
    const editCatBtn = document.getElementById('menu-edit-category');
    if (!dvw || !matchMap[dvw]) { if(delBtn) delBtn.style.display = 'none'; if(editCatBtn) editCatBtn.style.display = 'none'; return; }
    if(delBtn) delBtn.style.display = 'flex';
    if(editCatBtn) editCatBtn.style.display = 'flex';
    currentMatchDVW = dvw; player.loadVideoById(matchMap[dvw]);

    const searchInput = document.getElementById('searchFilter');
    if (searchInput) searchInput.value = '';
    const searchArea = document.getElementById('searchArea');
    if (searchArea) searchArea.classList.remove('show');
    activePlaylistFilter = null;

    document.getElementById('instanceList').innerHTML = `<div class="empty-msg">${t('analyzing')}</div>`;
    fetch(dvw).then(res => res.text()).then(parseDVW).catch(e => {
        document.getElementById('instanceList').innerHTML = `<div class="empty-msg">${t('file_error')}</div>`;
    });
}

// --- 4. 解析 (parseDVW) & UI連携 ---
function computeHighlightCandidates(rallyList) {
    const decidingSetNum = HIGHLIGHT_CONFIG.setsToWin * 2 - 1;
    rallyList.forEach(r => {
        const [h, a] = (r.score || "00-00").split('-').map(n => parseInt(n) || 0);
        const total = h + a, diff = Math.abs(h - a);
        const duration = (r.rallyEndTime || (r.startTime + 7.0)) - r.startTime;
        const isLongRally = HIGHLIGHT_CONFIG.enableRallySec && duration >= HIGHLIGHT_CONFIG.minRallySec;
        const isCloseScore = HIGHLIGHT_CONFIG.enableCloseScore && total >= HIGHLIGHT_CONFIG.breakMinTotalPoints && diff <= HIGHLIGHT_CONFIG.breakMaxDiff;
        const isCloseBreak = HIGHLIGHT_CONFIG.breakOnly ? (isCloseScore && r.wonBy === r.side) : isCloseScore;

        const setTarget = (r.setNum === decidingSetNum) ? 15 : 25;
        const leaderSide = h >= a ? '*' : 'a';
        const leaderScore = Math.max(h, a);
        const isSetPoint = leaderScore >= setTarget - 1 && diff >= 1;
        const leaderSets = leaderSide === '*' ? r.hSets : r.aSets;
        const isMatchPoint = isSetPoint && leaderSets === HIGHLIGHT_CONFIG.setsToWin - 1;

        r.highlightCandidate = isLongRally || isCloseBreak || isSetPoint || isMatchPoint;
    });
}

async function parseDVW(text) {
    allPlays = []; rallies = []; playerMaster = {}; const lines = text.split('\n');
    let currentSection = "", runningScore = "00-00", hSets = 0, aSets = 0, teamCount = 0, tempRally = null;
    let currentHomeRot = null, currentAwayRot = null, pointCodeCount = 0;

    lines.forEach(line => {
        const l = line.trim(); if (l.startsWith('[')) { currentSection = l; return; }
        if (currentSection === "[3TEAMS]") {
            const p = l.split(';'); if (p.length < 2) return;
            if (teamCount === 0) { document.getElementById('ov-h-code').innerText = p[0]; teamCount++; } else { document.getElementById('ov-a-code').innerText = p[0]; }
        }
        if (currentSection === "[3PLAYERS-H]" || currentSection === "[3PLAYERS-V]") {
            const p = l.split(';'); const side = currentSection.includes('-H') ? '*' : 'a'; const num = parseInt(p[1]);
            if (!isNaN(num)) playerMaster[`${side}_${num}`] = { name: (p[9] || p[10] || `Player ${num}`).trim(), num };
        }
        if (currentSection === "[3SCOUT]") {
            const c = l.split(';'); const code = c[0]; if (!code) return;
            if (code.startsWith('**') && code.toLowerCase().includes('set')) {
                const last = runningScore.split('-').map(Number); if (last[0] > last[1]) hSets++; else if (last[1] > last[0]) aSets++; runningScore = "00-00"; return;
            }
            if (code.toLowerCase().match(/^[a-z\*]p/)) {
                const m = code.match(/(\d{1,2})[:.](\d{1,2})/);
                if (m) {
                    const oldH = parseInt(runningScore.split('-')[0]) || 0, oldA = parseInt(runningScore.split('-')[1]) || 0;
                    const newH = parseInt(m[1]) || 0, newA = parseInt(m[2]) || 0;
                    runningScore = `${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
                    if (tempRally) {
                        const t12 = parseFloat(c[12]); tempRally.rallyEndTime = isNaN(t12) ? (tempRally.startTime + 7.0) : t12;
                        if (newH > oldH) tempRally.wonBy = '*'; else if (newA > oldA) tempRally.wonBy = 'a'; else tempRally.wonBy = code.toLowerCase().startsWith('*') ? '*' : 'a';
                    } pointCodeCount++;
                } return;
            }
            const skillChar = code.charAt(3);
            if ("SRABDE".includes(skillChar)) {
                const side = code.charAt(0), num = parseInt(code.substring(1,3)), time = parseFloat(c[12]);
                if (isNaN(num) || isNaN(time)) return;
                const p = playerMaster[`${side}_${num}`] || { name: `Player ${num}`, num };
                let rH = parseInt(c[9]); if (!isNaN(rH)) currentHomeRot = rH; else rH = currentHomeRot;
                let rA = parseInt(c[10]); if (!isNaN(rA)) currentAwayRot = rA; else rA = currentAwayRot;
                const playObj = { id: allPlays.length, time, startTime: time - 2.0, endTime: time + 5.0, score: runningScore, setNum: hSets+aSets+1, hSets, aSets, side, skill: skillChar, effect: code.charAt(5), pName: p.name, pNum: p.num, rot: (side === '*' ? rH : rA) || "?", rallyHomeRot: rH, rallyAwayRot: rA };
                if (skillChar === 'S') { tempRally = playObj; rallies.push(playObj); } else if (tempRally) { playObj.rallyHomeRot = tempRally.rallyHomeRot; playObj.rallyAwayRot = tempRally.rallyAwayRot; }
                allPlays.push(playObj);
            }
        }
    });

    computeHighlightCandidates(rallies);

    const autoNextEl = document.getElementById('autoNext');
    if(autoNextEl) autoNextEl.checked = (pointCodeCount > 0);

    updateFilters(); if (!IS_DEMO) await loadCloudData();

    let urlIds = window.initLinkData.ids;
    let urlQ = window.initLinkData.q;
    const urlT = window.initLinkData.t;

    if (!window.hasAppliedSharedLink) {
        window.hasAppliedSharedLink = true;

        if (urlIds) {
            document.getElementById('searchFilter').value = 'ids:' + urlIds;
            document.getElementById('searchArea').classList.add('show');
        } else if (urlQ) {
            document.getElementById('searchFilter').value = urlQ;
            document.getElementById('searchArea').classList.add('show');
        }

        render();

        if (urlT) {
            setTimeout(() => {
                const t = parseFloat(urlT); let targetIdx = 0, minDiff = Infinity;
                currentData.forEach((d,i) => { let diff = Math.abs(d.startTime - t); if (diff < minDiff) { minDiff = diff; targetIdx = i; } });
                if(currentData[targetIdx]) {
                    playIndex(targetIdx);
                    document.getElementById(`actions-${currentData[targetIdx].id}`)?.classList.add('show');
                }
            }, 1500);
        } else if ((urlQ || urlIds) && currentData.length > 0) {
            setTimeout(() => { playIndex(0); }, 1500);
        }
    } else {
        render();
    }
}

async function loadCloudData() {
    const [cRes, dRes] = await Promise.all([
        supabaseClient.from('comments').select('*').eq('match_dvw', currentMatchDVW).order('created_at', { ascending: true }),
        supabaseClient.from('drawings').select('*').eq('match_dvw', currentMatchDVW).order('created_at', { ascending: false })
    ]);
    const allComments = cRes.data || [];
    matchComments = {}; allComments.forEach(r => { if (!matchComments[r.play_id]) matchComments[r.play_id] = []; matchComments[r.play_id].push({ id: r.id, text: r.comment_text, protected: !!r.is_protected }); });
    matchDrawings = {}; (dRes.data || []).forEach(r => { if (!matchDrawings[r.play_id]) { try { matchDrawings[r.play_id] = JSON.parse(r.drawing_data); } catch(e){} } });

    const lsKey = `ss_last_seen_${MY_TEAM_CODE}_${currentMatchDVW}`;
    const lastSeen = localStorage.getItem(lsKey);
    if (lastSeen && allComments.length > 0) {
        const newOnes = allComments.filter(r => r.created_at && r.created_at > lastSeen);
        if (newOnes.length > 0) showNewCommentToast(newOnes);
    }
    if (allComments.length > 0) {
        const latest = allComments[allComments.length - 1].created_at;
        if (latest) localStorage.setItem(lsKey, latest);
    }

    activePlaylistFilter = null;
    await loadSavedPlaylists();
}

function showNewCommentToast(comments) {
    const existing = document.getElementById('new-comment-toast');
    if (existing) existing.remove();

    const playMap = {};
    comments.forEach(c => {
        if (!playMap[c.play_id]) playMap[c.play_id] = [];
        playMap[c.play_id].push(c.comment_text);
    });

    const lines = Object.entries(playMap).map(([pid, texts]) => {
        const play = allPlays.find(p => p.id === parseInt(pid));
        const label = play ? `#${play.pNum} ${play.pName.split(' ')[0]}` : `#${pid}`;
        return `<div style="margin-bottom:4px;"><strong>${escapeHtml(label)}</strong>: ${texts.map(t => escapeHtml(t)).join(', ')}</div>`;
    }).join('');

    const toast = document.createElement('div');
    toast.id = 'new-comment-toast';
    toast.style.cssText = 'position:fixed;top:60px;right:16px;z-index:999;background:#1a2040;color:#fff;border-radius:12px;padding:14px 18px;max-width:320px;box-shadow:0 8px 32px rgba(0,0,0,0.3);font-size:13px;line-height:1.5;cursor:pointer;animation:slideIn 0.3s ease;border-left:4px solid #4f6ef7;';
    toast.innerHTML = `<div style="font-weight:700;margin-bottom:6px;color:#8ba3ff;">${t('new_comments', { n: comments.length })}</div>${lines}`;
    toast.onclick = () => toast.remove();
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 8000);
}

function updateFilters() {
    const h = escapeHtml(document.getElementById('ov-h-code').innerText), a = escapeHtml(document.getElementById('ov-a-code').innerText);
    document.getElementById('teamFilterRally').innerHTML = `<option value="">${t('both_teams')}</option><option value="*">${h}${t('serves')}</option><option value="a">${a}${t('serves')}</option>`;
    document.getElementById('teamFilterPlayer').innerHTML = `<option value="">${t('select_team')}</option><option value="*">${h}</option><option value="a">${a}</option>`;
    document.getElementById('score-overlay').style.display = 'flex';
}
function clearActivePlaylist() {
    activePlaylistFilter = null;
    const sel = document.getElementById('playlistSelect');
    if (sel) sel.value = '';
}
function onFilterChange() {
    clearActivePlaylist();
    render();
}
function toggleHighlightOnly() {
    showHighlightOnly = document.getElementById('highlightOnlyFilter').checked;
    clearActivePlaylist();
    render();
}
function onTeamChangePlayer() {
    clearActivePlaylist();
    const team = document.getElementById('teamFilterPlayer').value, ps = document.getElementById('playerFilter'); ps.innerHTML = `<option value="">${t('all_players')}</option>`; if (!team) return;
    const seen = new Set(); allPlays.filter(p => p.side === team).forEach(p => { if (!seen.has(p.pName)) { ps.add(new Option(`#${p.pNum} ${p.pName}`, p.pName)); seen.add(p.pName); } }); render();
}
function setMode(m) {
    currentMode = m; document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active')); if(document.getElementById('btn-' + m)) document.getElementById('btn-' + m).classList.add('active');
    document.getElementById('filterArea').style.display = (m === 'stats' || m === 'rotation') ? 'none' : 'block';
    document.getElementById('rally-filters').style.display = (m === 'rally') ? 'flex' : 'none';
    document.getElementById('player-filters').style.display = (m === 'player') ? 'flex' : 'none';
    activePlaylistFilter = null;
    render();
}
function toggleSearchArea() {
    document.getElementById('searchArea').classList.toggle('show');
}
function toggleOverlay() {
    const ov = document.getElementById('score-overlay');
    if (!ov) return;
    ov.style.display = ov.style.display === 'none' ? 'flex' : 'none';
}

// ==========================================
// 5. フルレンダー (リスト、スタッツ、ローテ)
// ==========================================
function render() {
    const list = document.getElementById('instanceList');
    if(!list) return;
    list.innerHTML = '';

    if (currentMode === 'stats') { renderDualTables(); return; }
    if (currentMode === 'rotation') { renderRotationTables(); return; }

    let data = [];

    if (activePlaylistFilter) {
        data = allPlays.filter(d => activePlaylistFilter.has(d.id));
    } else {
        const q = document.getElementById('searchFilter').value.toLowerCase().trim();

        if (q.startsWith('rot:')) {
            const p = q.split(','); const tSide = p[0].replace('rot:', '').trim(), phase = p[1], rot = parseInt(p[2]);
            if (phase === 'so') data = rallies.filter(d => d.side === (tSide === '*' ? 'a' : '*') && (tSide === '*' ? d.rallyHomeRot : d.rallyAwayRot) === rot);
            else if (phase === 'bp') data = rallies.filter(d => d.side === tSide && (tSide === '*' ? d.rallyHomeRot : d.rallyAwayRot) === rot);

        } else if (q.startsWith('ids:')) {
            const idArray = q.replace('ids:', '').split(',').map(Number);
            data = allPlays.filter(d => idArray.includes(d.id));

        } else if (q.startsWith('id:')) {
            data = allPlays.filter(d => d.id === parseInt(q.replace('id:', '').trim()));

        } else if (q) {
            data = allPlays.filter(d => `${d.pName} ${d.skill} ${(matchComments[d.id]||[]).map(c => c.text).join(' ')}`.toLowerCase().includes(q));
        } else {
            if (currentMode === 'rally') {
                data = rallies; const tf = document.getElementById('teamFilterRally').value; if(tf) data = data.filter(d => d.side === tf);
            } else {
                data = allPlays; const tf = document.getElementById('teamFilterPlayer').value;
                if (!tf) { list.innerHTML = `<div class="empty-msg">${t('select_team_msg')}</div>`; return; }
                const pF = document.getElementById('playerFilter').value, sF = document.getElementById('skillFilter').value, eF = document.getElementById('effectFilter').value;
                data = data.filter(d => d.side === tf && (!pF || d.pName === pF) && (!sF || d.skill === sF) && (!eF || d.effect === eF));
            }
        }
    }

    if (showHighlightOnly) data = data.filter(d => d.highlightCandidate);

    currentData = data;
    if (currentData.length === 0) { list.innerHTML = `<div class="empty-msg">${t('no_plays')}</div>`; return; }

    function getSkillBadge(skill, effect) {
        const map = {
            'A': { label: 'ATK', cls: 'badge-atk' },
            'S': { label: 'SRV', cls: 'badge-srv' },
            'R': { label: 'RCV', cls: 'badge-rcv' },
            'B': { label: 'BLK', cls: 'badge-blk' },
            'D': { label: 'DIG', cls: 'badge-dig' },
            'E': { label: 'SET', cls: 'badge-set' },
        };
        const info = map[skill];
        if (!info) return '';
        let effectCls = '';
        if (effect === '#') effectCls = ' badge-kill';
        else if (effect === '=') effectCls = ' badge-err';
        else if (effect === '+') effectCls = ' badge-pos';
        return `<span class="skill-badge ${info.cls}${effectCls}">${info.label}</span>`;
    }

    let lastSet = -1;
    currentData.forEach((d, i) => {
        if (d.setNum !== lastSet) {
            list.innerHTML += `<div class="stats-section-title">SET ${d.setNum}</div>`;
            lastSet = d.setNum;
        }

        const btn = document.createElement('div');
        btn.className = `instance-btn`;
        btn.id = 'idx-'+i;

        if (d.side === '*') btn.style.borderLeftColor = 'var(--home-accent)';
        else if (d.side === 'a') btn.style.borderLeftColor = 'var(--away-accent)';

        const skillBadge = getSkillBadge(d.skill, d.effect);
        const skillClassMap = { A:'card-atk', S:'card-srv', R:'card-rcv', B:'card-blk', D:'card-dig', E:'card-set' };
        if (skillClassMap[d.skill]) btn.classList.add(skillClassMap[d.skill]);
        if (d.effect === '#') btn.classList.add('card-kill');
        else if (d.effect === '=' || (d.effect === '/' && d.skill !== 'B' && d.skill !== 'D')) btn.classList.add('card-error');

        const cHTML = (matchComments[d.id] || []).map((c, cidx) => `<div class="comment-item"><span>${escapeHtml(c.text)}</span><span class="del-comment" onclick="event.stopPropagation(); deleteComment(${d.id}, ${cidx})">&#x2716;</span></div>`).join('');
        const hasDraw = (matchDrawings[d.id] && matchDrawings[d.id].length > 0) ? 'style="background:var(--danger-subtle); color:var(--danger); font-weight:bold;"' : '';
        const cCount = (matchComments[d.id] || []).length;
        const noteBtnStyle = cCount > 0 ? `style="background:var(--primary-subtle); color:var(--primary); font-weight:bold;"` : '';

        btn.innerHTML = `
            <div class="card-main" onclick="playIndex(${i})">
                <div class="score-box">${escapeHtml(d.score)}</div>
                <div style="flex:1; line-height:1.3;">
                    <div style="font-weight:700; font-size:0.88rem; color:var(--text);">#${escapeHtml(d.pNum)} ${escapeHtml(d.pName.split(' ')[0])} ${skillBadge}${d.highlightCandidate ? `<span class="skill-badge" style="background:var(--danger-subtle); color:var(--danger);">&#x1F525; ${t('highlight_badge')}</span>` : ''}</div>
                    <div style="color:var(--text-muted); font-size:0.75rem; margin-top:2px; font-weight:500;">P${escapeHtml(d.rot)} &middot; ${escapeHtml(d.skill)}${escapeHtml(d.effect)}</div>
                </div>
            </div>
            ${IS_DEMO ? '' : `<div class="top-right-actions">
                <button class="action-sm-btn" ${noteBtnStyle} onclick="toggleActions(event, ${i})">&#x1F4AC; ${t('note_label')} ${cCount ? `(${cCount})` : ''}</button>
            </div>
            <div class="card-actions" id="actions-${i}">
                <div id="c-disp-${d.id}">${cHTML}</div>
                <div class="action-row" style="margin-bottom:5px;">
                    <button class="action-btn" ${hasDraw} style="background:var(--text-secondary); color:#fff; flex:1; display:flex; align-items:center; justify-content:center; gap:4px;" onclick="event.stopPropagation(); enterDrawMode(${d.id})">&#x270F;&#xFE0F; ${t('draw_label')}</button>
                </div>
                <div class="action-row">
                    <div class="tag-popup" id="tags-${d.id}">${starterTags.map(tg => `<div class="tag-chip" onmousedown="event.preventDefault()" onclick="applyTag(${d.id}, '${tg}')">${tg}</div>`).join('')}</div>
                    <button class="tag-trigger" onmousedown="event.preventDefault()" onclick="event.stopPropagation(); toggleTagPopup(${d.id})">#</button>
                    <div style="flex:1; position:relative;">
                      <input type="text" class="comment-input" id="c-input-${d.id}" placeholder="${t('note_placeholder')}" autocomplete="off" oninput="handleSuggestInput(event, ${d.id})" onclick="event.stopPropagation()" onkeydown="if(event.key === 'Enter'){ event.preventDefault(); event.stopPropagation(); addComment(${d.id}); }">
                        <div class="auto-suggest-box" id="suggest-${d.id}"></div>
                    </div>
                    <button class="action-btn add-btn" onmousedown="event.preventDefault()" onclick="event.stopPropagation(); addComment(${d.id})">${t('send')}</button>
                </div>
                <div class="action-row" style="margin-top: 5px;">
                    <button class="action-btn copy-link-btn" onclick="event.stopPropagation(); copyPlayLink(${i})">&#x1F517; ${t('copy_link')}</button>
                    <button class="action-btn line-btn" onclick="event.stopPropagation(); shareViaLINE(${i})" style="background:#06C755; color:#fff;">&#x1F4AC; ${t('share_line')}</button>
                    <button class="action-btn" onclick="event.stopPropagation(); shareViaWhatsApp(${i})" style="background:#25D366; color:#fff;">&#x1F4AC; ${t('share_whatsapp')}</button>
                </div>
            </div>`}`;
        list.appendChild(btn);
    });
}

// 統計 & ローテ表
function renderDualTables() {
    const list = document.getElementById('instanceList'); list.innerHTML = '';
    ["*", "a"].forEach(side => {
        const team = escapeHtml(side === "*" ? document.getElementById('ov-h-code').innerText : document.getElementById('ov-a-code').innerText);
        list.innerHTML += `<div class="stats-section-title">${team}${t('stats_label')}</div><div class="stats-container"><table class="stats-table" id="t-${side}"></table></div>`;
        buildTable(side, `t-${side}`);
    });
}

function buildTable(side, targetId) {
    const ps = []; const seen = new Set();

    allPlays.filter(p => p.side === side).forEach(p => {
        if (!p.pNum || isNaN(parseInt(p.pNum)) || p.pNum === "undefined" || p.pNum === "NaN") return;
        if (!seen.has(p.pName)) {
            ps.push({ name: p.pName, num: parseInt(p.pNum) });
            seen.add(p.pName);
        }
    });

    ps.sort((a,b) => a.num - b.num);

    let html = `<tr><th rowspan="2">${t('player_col')}</th><th colspan="3">Serve</th><th colspan="4">Rec</th><th colspan="4">Attack</th></tr><tr><th>Tot</th><th>Ace</th><th>Err</th><th>Tot</th><th>Err</th><th>#+%</th><th>#%</th><th>Tot</th><th>Kill</th><th>Err</th><th>%</th></tr>`;

    ps.forEach(p => {
        const pl = allPlays.filter(play => play.pName === p.name && play.side === side), s = pl.filter(d => d.skill === 'S'), r = pl.filter(d => d.skill === 'R'), a = pl.filter(d => d.skill === 'A');
        const sAce = s.filter(d => d.effect === '#').length, sErr = s.filter(d => d.effect === '=').length;
        const rErr = r.filter(d => d.effect === '=').length, rPerf = r.filter(d => d.effect === '#').length, rPos = r.filter(d => d.effect === '+').length;
        const aKill = a.filter(d => d.effect === '#').length, aLoss = a.filter(d => d.effect === '=' || d.effect === '/').length;
        const esc = jsAttr(p.name);

        html += `<tr>
            <td style="text-align:left; font-weight:600;">#${p.num} ${escapeHtml(p.name.split(' ')[0])}</td>
            <td><span class="click-num" onclick="jumpToStat('${side}',${esc},'S','')">${s.length}</span></td><td>${sAce}</td><td>${sErr}</td>
            <td><span class="click-num" onclick="jumpToStat('${side}',${esc},'R','')">${r.length}</span></td><td>${rErr}</td><td>${r.length?Math.round((rPerf+rPos)/r.length*100):0}%</td><td>${r.length?Math.round(rPerf/r.length*100):0}%</td>
            <td><span class="click-num" onclick="jumpToStat('${side}',${esc},'A','')">${a.length}</span></td><td>${aKill}</td><td>${aLoss}</td><td>${a.length?((aKill/a.length)*100).toFixed(1):'0'}%</td>
        </tr>`;
    });
    document.getElementById(targetId).innerHTML = html;
}

function renderRotationTables() {
    const list = document.getElementById('instanceList'); list.innerHTML = '';
    ["*", "a"].forEach(side => {
        const team = escapeHtml(side === "*" ? document.getElementById('ov-h-code').innerText : document.getElementById('ov-a-code').innerText);
        list.innerHTML += `<div class="stats-section-title">${team}${t('rotation_label')}</div><div class="stats-container"><table class="stats-table" id="t-rot-${side}"></table></div>`;
        buildRotationTable(side, `t-rot-${side}`);
    });
}

function buildRotationTable(side, targetId) {
    let html = `<tr><th rowspan="2">Rot</th><th colspan="3">Side Out Phase</th><th colspan="5">Break Phase</th></tr><tr><th>Tot</th><th>Won</th><th>SO %</th><th>Tot</th><th>Ace</th><th>Err</th><th>Won</th><th>BP %</th></tr>`;
    [1, 6, 5, 4, 3, 2].forEach(r => {
        const oppSide = side === '*' ? 'a' : '*';
        const soRallies = rallies.filter(d => d.side === oppSide && (side === '*' ? d.rallyHomeRot : d.rallyAwayRot) === r);
        const soTot = soRallies.length, soWon = soRallies.filter(d => d.wonBy === side).length, soPct = soTot ? Math.round((soWon / soTot) * 100) : 0;
        const soColor = soPct >= 65 ? 'var(--danger)' : (soPct < 50 ? 'var(--primary)' : 'var(--text)');

        const bpRallies = rallies.filter(d => d.side === side && (side === '*' ? d.rallyHomeRot : d.rallyAwayRot) === r);
        const bpTot = bpRallies.length, bpAce = bpRallies.filter(d => d.effect === '#').length, bpErr = bpRallies.filter(d => d.effect === '=').length;
        const bpWon = bpRallies.filter(d => d.wonBy === side).length, bpPct = bpTot ? Math.round((bpWon / bpTot) * 100) : 0;
        const bpColor = bpPct >= 40 ? 'var(--danger)' : (bpPct < 25 ? 'var(--primary)' : 'var(--text)');

        html += `<tr>
            <td style="font-weight:700; background:var(--primary-subtle); color:var(--primary);">P${r}</td>
            <td><span class="click-num" onclick="jumpToRotationRallies('${side}', ${r}, 'so')">${soTot}</span></td><td>${soWon}</td><td style="font-weight:700; color:${soColor}">${soPct}%</td>
            <td><span class="click-num" onclick="jumpToRotationRallies('${side}', ${r}, 'bp')">${bpTot}</span></td><td>${bpAce}</td><td>${bpErr}</td><td>${bpWon}</td><td style="font-weight:700; color:${bpColor}">${bpPct}%</td>
        </tr>`;
    });
    document.getElementById(targetId).innerHTML = html;
}

// 補助機能
function jumpToStat(side, pName, skill, eff) {
    document.getElementById('searchFilter').value = '';
    document.getElementById('searchArea').classList.remove('show');
    setMode('player');
    document.getElementById('teamFilterPlayer').value = side; onTeamChangePlayer();
    document.getElementById('playerFilter').value = pName;
    document.getElementById('skillFilter').value = skill;
    document.getElementById('effectFilter').value = eff;
    render();
    if (currentData.length > 0) playIndex(0);
}

function jumpToRotationRallies(side, rNum, phase) {
    document.getElementById('searchFilter').value = `rot:${side},${phase},${rNum}`;
    document.getElementById('searchArea').classList.add('show');
    setMode('rally');
    if(currentData.length > 0) playIndex(0);
}

// ==========================================
// 6. DB連携 & アクション (チーム隔離)
// ==========================================
function updateCommentDisplay(playId) {
    const disp = document.getElementById(`c-disp-${playId}`);
    if (!disp) return;
    const comments = matchComments[playId] || [];
    disp.innerHTML = comments.map((c, cidx) => `<div class="comment-item"><span>${c.protected ? '&#x1F512; ' : ''}${escapeHtml(c.text)}</span>${c.protected ? '' : `<span class="del-comment" onclick="event.stopPropagation(); deleteComment(${playId}, ${cidx})">&#x2716;</span>`}</div>`).join('');
    const cardEl = disp.closest('.instance-btn');
    if (cardEl) {
        const noteBtn = cardEl.querySelector('.action-sm-btn');
        if (noteBtn) {
            const count = comments.length;
            noteBtn.innerHTML = `&#x1F4AC; ${t('note_label')} ${count ? `(${count})` : ''}`;
            if (count > 0) { noteBtn.style.background = 'var(--primary-subtle)'; noteBtn.style.color = 'var(--primary)'; noteBtn.style.fontWeight = 'bold'; }
            else { noteBtn.style.background = ''; noteBtn.style.color = ''; noteBtn.style.fontWeight = ''; }
        }
    }
}

async function addComment(playId) {
    const input = document.getElementById(`c-input-${playId}`);
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    const { data, error } = await supabaseClient
        .from('comments')
        .insert([{ match_dvw: currentMatchDVW, play_id: playId, comment_text: text }])
        .select('id')
        .single();

    if (error || !data) {
        alert(t('comment_save_fail'));
        input.value = text;
        return;
    }

    if (!matchComments[playId]) matchComments[playId] = [];
    matchComments[playId].push({ id: data.id, text });
    updateCommentDisplay(playId);
}

async function deleteComment(playId, idx) {
    const comment = (matchComments[playId] || [])[idx];
    if (!comment) return;
    if (comment.protected) { alert(t('comment_protected')); return; }
    if(!confirm(t('confirm_delete_comment'))) return;

    const { error } = await supabaseClient.from('comments').delete().eq('id', comment.id);
    if (error) {
        alert(t('comment_delete_fail'));
        return;
    }

    matchComments[playId].splice(idx, 1);
    updateCommentDisplay(playId);
}

function toggleActions(event, index, forceShow = false) {
    if(event) event.stopPropagation();
    const div = document.getElementById(`actions-${index}`);
    if(!div) return;
    const willShow = forceShow || !div.classList.contains('show');
    if (willShow) {
        document.querySelectorAll('.card-actions.show').forEach(el => {
            if (el === div) return;
            const input = el.querySelector('.comment-input');
            if (input && document.activeElement === input) input.blur();
            el.classList.remove('show');
        });
        div.classList.add('show');
    } else {
        div.classList.remove('show');
    }
}

function handleSuggestInput(e, playId) {
    const val = e.target.value, cursorStart = e.target.selectionStart, words = val.substring(0, cursorStart).split(/\s+/), currentWord = words[words.length - 1], suggestBox = document.getElementById(`suggest-${playId}`);
    if (currentWord.length > 0) {
        const searchStr = currentWord.replace(/^#/, '').toLowerCase(), matches = starterTags.filter(tg => tg.toLowerCase().includes(searchStr) || tg.toLowerCase().replace(/^#/, '').includes(searchStr));
        if (matches.length > 0) {
            suggestBox.innerHTML = matches.map((m, idx) => `<div class="s-item ${idx === 0 ? 'active' : ''}" onmousedown="event.preventDefault()" onclick="event.stopPropagation(); selectSuggest(${playId}, '${m}')">${m}</div>`).join('');
            suggestBox.style.display = 'block';
            suggestBox.dataset.activeIdx = 0;
            suggestBox.dataset.word = currentWord;
            return;
        }
    }
    suggestBox.style.display = 'none';
}

function selectSuggest(playId, tag) {
    const input = document.getElementById(`c-input-${playId}`), suggestBox = document.getElementById(`suggest-${playId}`), currentWord = suggestBox.dataset.word;
    const val = input.value, cursorStart = input.selectionStart, textBeforeCursor = val.substring(0, cursorStart), textAfterCursor = val.substring(cursorStart);
    const newTextBefore = textBeforeCursor.substring(0, textBeforeCursor.length - currentWord.length) + tag + ' ';
    input.value = newTextBefore + textAfterCursor;
    input.focus();
    input.selectionStart = input.selectionEnd = newTextBefore.length;
    suggestBox.style.display = 'none';
}

function toggleTagPopup(playId) {
    const show = document.getElementById(`tags-${playId}`).classList.contains('show');
    document.querySelectorAll('.tag-popup').forEach(p => p.classList.remove('show'));
    if(!show) document.getElementById(`tags-${playId}`).classList.add('show');
}

function applyTag(playId, tag) {
    const input = document.getElementById(`c-input-${playId}`);
    input.value = (input.value.trim() + " " + tag).trim() + " ";
    input.focus();
    document.querySelectorAll('.tag-popup').forEach(p => p.classList.remove('show'));
}

function playIndex(i) {
    if (i < 0 || i >= currentData.length) return;
    currentIndex = i;
    const d = currentData[i];
    player.seekTo(d.startTime, true);
    player.playVideo();

    document.getElementById('ov-h-sets').innerText = d.hSets;
    document.getElementById('ov-a-sets').innerText = d.aSets;
    const s = d.score.split('-');
    document.getElementById('ov-h-score').innerText = parseInt(s[0]) || 0;
    document.getElementById('ov-a-score').innerText = parseInt(s[1]) || 0;

    resizeCanvas();
    if (matchDrawings[d.id]) { drawingLines = matchDrawings[d.id]; renderDrawing(); }
    else { ctx.clearRect(0,0,canvas.width,canvas.height); }

    document.querySelectorAll('.instance-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('idx-' + i)?.classList.add('active');
    document.getElementById('idx-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function playNext() { if (currentIndex < currentData.length - 1) playIndex(currentIndex + 1); }
function playPrev() { if (currentIndex > 0) playIndex(currentIndex - 1); }
function seekSeconds(s) { if (player && player.getCurrentTime) player.seekTo(player.getCurrentTime() + s, true); }
function replayCurrentPlay() { if (currentIndex >= 0 && currentData[currentIndex]) { player.seekTo(currentData[currentIndex].startTime, true); player.playVideo(); } }

function toggleTheaterMode() {
    const isTheater = document.body.classList.toggle('theater-mode');
    if (isTheater) {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
        }
        requestAppFullscreen();
    } else {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        document.body.classList.remove('forced-landscape');
        exitAppFullscreen();
    }
}

function requestAppFullscreen() {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (!req) return;
    try { Promise.resolve(req.call(el)).catch(() => {}); } catch (e) {}
}

function exitAppFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) return;
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!exit) return;
    try { Promise.resolve(exit.call(document)).catch(() => {}); } catch (e) {}
}

function toggleForcedLandscape() {
    document.body.classList.toggle('forced-landscape');
}

// ==========================================
// 7. お絵かき (Telestrator)
// ==========================================
const canvas = document.getElementById('telestratorCanvas'), ctx = canvas ? canvas.getContext('2d') : null;
let isDrawingMode = false, isDrawing = false, drawingLines = [], activePlayIdForDraw = null, currentDrawTool = 'freehand', currentShape = null, currentPath = [];

function setDrawTool(tool) {
    currentDrawTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tool-' + tool).classList.add('active');
}

function initTelestrator() {
    if(!canvas) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, {passive:false});
    canvas.addEventListener('touchmove', draw, {passive:false});
    canvas.addEventListener('touchend', stopDrawing);

    let swipeStartX = 0, swipeStartY = 0;
    const box = document.getElementById('player-box');
    box.addEventListener('touchstart', e => {
        if (isDrawingMode) return;
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
    }, { passive: true });
    box.addEventListener('touchend', e => {
        if (isDrawingMode) return;
        const dx = e.changedTouches[0].clientX - swipeStartX;
        const dy = e.changedTouches[0].clientY - swipeStartY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            seekSeconds(dx > 0 ? 3 : -3);
            e.preventDefault();
        }
    }, { passive: false });
}

function resizeCanvas() {
    const box = document.getElementById('player-box');
    if(!box || !canvas) return;
    canvas.width = box.offsetWidth;
    canvas.height = box.offsetHeight;
    renderDrawing();
}

function getNormPos(e) {
    const rect = canvas.getBoundingClientRect();
    let cX = e.clientX, cY = e.clientY;
    if (e.touches && e.touches.length > 0) { cX = e.touches[0].clientX; cY = e.touches[0].clientY; }
    return { x: (cX - rect.left) / canvas.width, y: (cY - rect.top) / canvas.height };
}

function startDrawing(e) {
    if (!isDrawingMode) return;
    e.preventDefault(); isDrawing = true;
    const pos = getNormPos(e);
    if (currentDrawTool === 'freehand') currentPath = [pos];
    else currentShape = { type: currentDrawTool, start: pos, end: pos };
}

function draw(e) {
    if (!isDrawing || !isDrawingMode) return;
    e.preventDefault();
    const pos = getNormPos(e);
    if (currentDrawTool === 'freehand') currentPath.push(pos);
    else currentShape.end = pos;
    renderDrawing();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    if (currentDrawTool === 'freehand' && currentPath.length > 1) drawingLines.push(currentPath);
    else if (currentShape && (currentShape.start.x !== currentShape.end.x || currentShape.start.y !== currentShape.end.y)) drawingLines.push(currentShape);
    currentPath = []; currentShape = null;
    renderDrawing();
}

function drawItem(ctx, item, w, h) {
    if (Array.isArray(item)) {
        if (item.length < 2) return;
        ctx.beginPath(); ctx.moveTo(item[0].x * w, item[0].y * h);
        for (let i = 1; i < item.length; i++) ctx.lineTo(item[i].x * w, item[i].y * h);
        ctx.stroke();
    }
    else if (item.type === 'arrow') {
        const hl = 15, dx = item.end.x * w - item.start.x * w, dy = item.end.y * h - item.start.y * h, angle = Math.atan2(dy, dx);
        ctx.beginPath(); ctx.moveTo(item.start.x * w, item.start.y * h); ctx.lineTo(item.end.x * w, item.end.y * h);
        ctx.lineTo(item.end.x * w - hl * Math.cos(angle - Math.PI/6), item.end.y * h - hl * Math.sin(angle - Math.PI/6));
        ctx.moveTo(item.end.x * w, item.end.y * h);
        ctx.lineTo(item.end.x * w - hl * Math.cos(angle + Math.PI/6), item.end.y * h - hl * Math.sin(angle + Math.PI/6));
        ctx.stroke();
    }
    else if (item.type === 'circle') {
        const rx = Math.abs(item.end.x - item.start.x) * w / 2, ry = Math.abs(item.end.y - item.start.y) * h / 2;
        const cx = (item.start.x + item.end.x) * w / 2, cy = (item.start.y + item.end.y) * h / 2;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI); ctx.stroke();
    }
    else if (item.type === 'rect') {
        const x = item.start.x * w, y = item.start.y * h;
        const rw = (item.end.x - item.start.x) * w, rh = (item.end.y - item.start.y) * h;
        ctx.beginPath(); ctx.rect(x, y, rw, rh); ctx.stroke();
    }
}

function renderDrawing() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    drawingLines.forEach(item => drawItem(ctx, item, canvas.width, canvas.height));
    if (isDrawing) {
        if (currentDrawTool === 'freehand' && currentPath.length > 0) drawItem(ctx, currentPath, canvas.width, canvas.height);
        else if (currentShape) drawItem(ctx, currentShape, canvas.width, canvas.height);
    }
}

function enterDrawMode(playId) {
    player.pauseVideo(); isDrawingMode = true; activePlayIdForDraw = playId;
    canvas.classList.add('drawing-mode'); document.getElementById('draw-toolbar').style.display = 'flex';
    resizeCanvas(); drawingLines = matchDrawings[playId] ? JSON.parse(JSON.stringify(matchDrawings[playId])) : [];
    renderDrawing();
}

function exitDrawMode() {
    isDrawingMode = false; canvas.classList.remove('drawing-mode'); document.getElementById('draw-toolbar').style.display = 'none';
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function clearCanvas() { drawingLines = []; renderDrawing(); }
function undoDrawing() { if (drawingLines.length > 0) { drawingLines.pop(); renderDrawing(); } }

async function saveDrawing() {
    const playId = activePlayIdForDraw;
    const snapshot = JSON.parse(JSON.stringify(drawingLines));
    if (snapshot.length > 0) matchDrawings[playId] = snapshot;
    else delete matchDrawings[playId];
    render(); exitDrawMode(); player.playVideo();

    const { error: delErr } = await supabaseClient.from('drawings').delete().match({ match_dvw: currentMatchDVW, play_id: playId });
    if (delErr) { alert(t('drawing_save_fail')); return; }

    if (snapshot.length === 0) return;

    const { error: insErr } = await supabaseClient.from('drawings').insert([{ match_dvw: currentMatchDVW, play_id: playId, drawing_data: JSON.stringify(snapshot) }]);
    if (insErr) alert(t('drawing_save_fail'));
}

// --- キーボードショートカット ---
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { if (isDrawingMode) { undoDrawing(); e.preventDefault(); return; } }
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA';
    if (isInput) return;
    const key = e.key.toLowerCase();

    const activeSuggest = document.querySelector('.auto-suggest-box[style*="block"]');
    if (activeSuggest) {
        const items = activeSuggest.querySelectorAll('.s-item');
        let idx = parseInt(activeSuggest.dataset.activeIdx) || 0;
        if (e.key === 'ArrowUp') {
            idx = (idx - 1 + items.length) % items.length;
            items.forEach((el, i) => el.classList.toggle('active', i === idx));
            activeSuggest.dataset.activeIdx = idx; e.preventDefault(); return;
        } else if (e.key === 'ArrowDown') {
            idx = (idx + 1) % items.length;
            items.forEach((el, i) => el.classList.toggle('active', i === idx));
            activeSuggest.dataset.activeIdx = idx; e.preventDefault(); return;
        } else if (e.key === 'Enter') {
            items[idx]?.click(); e.preventDefault(); return;
        }
    }

    if (key === 'f') playNext();
    else if (key === 'd') playPrev();
    else if (key === 'r') { replayCurrentPlay(); }
    else if (key === 'c') {
        if (currentIndex >= 0 && currentData[currentIndex]) {
            toggleActions(null, currentIndex, true);
            setTimeout(() => document.getElementById(`c-input-${currentData[currentIndex].id}`)?.focus(), 50);
        }
    }
    else if (e.key === 'ArrowLeft') { player.seekTo(player.getCurrentTime() - 2, true); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { player.seekTo(player.getCurrentTime() + 2, true); e.preventDefault(); }
    else if (key === 'p') { if (isDrawingMode) saveDrawing(); else if (currentIndex >= 0) enterDrawMode(currentData[currentIndex].id); }
});

// --- シェア機能 ---
function copyPlayLink(index) {
    const d = currentData[index];
    if (!d) return;
    const url = new URL(window.location.href);
    url.searchParams.set('match', currentMatchDVW);
    url.searchParams.set('t', d.startTime.toFixed(1));


    navigator.clipboard.writeText(url.toString()).then(() => {
        alert(t('link_copied'));
    }).catch(err => {
        alert(t('copy_fail') + err);
    });
}

function getPlayShareURL(index) {
    const d = currentData[index];
    if (!d) return null;
    const url = new URL(window.location.href);
    url.searchParams.set('match', currentMatchDVW);
    url.searchParams.set('t', d.startTime.toFixed(1));

    return { url: url.toString(), title: `SyncScout: Set${d.setNum} [${d.score}] #${d.pNum} ${d.pName}` };
}

function sharePlay(index) {
    const info = getPlayShareURL(index);
    if (!info) return;
    if (navigator.share) {
        navigator.share({ title: info.title, url: info.url }).catch(() => {});
    } else {
        navigator.clipboard.writeText(info.title + '\n' + info.url).then(() => {
            alert(t('link_copied'));
        }).catch(err => { alert(t('copy_fail') + err); });
    }
}

function shareViaLINE(index) {
    const info = getPlayShareURL(index);
    if (!info) return;
    const text = info.title + '\n' + info.url;
    window.open('https://line.me/R/msg/text/?' + encodeURIComponent(text), '_blank');
}

function shareViaWhatsApp(index) {
    const info = getPlayShareURL(index);
    if (!info) return;
    const text = info.title + '\n' + info.url;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

function getPlaylistURL() {
    if (currentData.length === 0) return null;
    const ids = currentData.map(d => d.id).join(',');
    const url = new URL(window.location.href);
    url.searchParams.set('match', currentMatchDVW);
    url.searchParams.set('ids', ids);

    return url.toString();
}

function copyPlaylistLink() {
    const url = getPlaylistURL();
    if (!url) return alert(t('no_plays_to_share'));
    navigator.clipboard.writeText(url).then(() => {
        alert(t('playlist_copied', { n: currentData.length }));
    }).catch(err => {
        alert(t('copy_fail') + err);
    });
}

function sharePlaylist() {
    const url = getPlaylistURL();
    if (!url) return alert(t('no_plays_to_share'));

    const title = `SyncScout: ${currentData.length} plays playlist`;
    if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(() => {});
    } else {
        navigator.clipboard.writeText(title + '\n' + url).then(() => {
            alert(t('playlist_copied', { n: currentData.length }));
        }).catch(err => { alert(t('copy_fail') + err); });
    }
}

function sharePlaylistViaLINE() {
    const url = getPlaylistURL();
    if (!url) return alert(t('no_plays_to_share'));
    const text = `SyncScout: ${currentData.length} plays playlist\n${url}`;
    window.open('https://line.me/R/msg/text/?' + encodeURIComponent(text), '_blank');
}

function sharePlaylistViaWhatsApp() {
    const url = getPlaylistURL();
    if (!url) return alert(t('no_plays_to_share'));
    const text = `SyncScout: ${currentData.length} plays playlist\n${url}`;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

// --- プレイリスト保存・読み込み ---
let savedPlaylists = [];

async function loadSavedPlaylists() {
    if (!currentMatchDVW) return;
    try {
        const { data, error } = await supabaseClient.from('playlists').select('*').eq('match_dvw', currentMatchDVW).order('created_at', { ascending: false });
        savedPlaylists = error ? [] : (data || []);
    } catch (e) {
        savedPlaylists = [];
    }
    renderPlaylistDropdown();
}

function renderPlaylistDropdown() {
    const sel = document.getElementById('playlistSelect');
    if (!sel) return;
    sel.innerHTML = `<option value="">${t('playlist_select')} (${savedPlaylists.length})</option>`;
    savedPlaylists.forEach((pl, i) => {
        const ids = JSON.parse(pl.play_ids);
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${pl.name} (${ids.length})`;
        sel.appendChild(opt);
    });
    if (savedPlaylists.length > 0) {
        const delOpt = document.createElement('option');
        delOpt.value = '__manage__';
        delOpt.textContent = '── ✕ ' + (currentLang === 'ja' ? '削除...' : 'Delete...');
        sel.appendChild(delOpt);
    }
}

async function saveCurrentAsPlaylist() {
    if (currentData.length === 0) return alert(t('no_plays_to_share'));
    const name = prompt(t('playlist_name_prompt'));
    if (!name || !name.trim()) return;
    const ids = currentData.map(d => d.id);
    const { error } = await supabaseClient.from('playlists').insert([{
        match_dvw: currentMatchDVW,
        name: name.trim(),
        play_ids: JSON.stringify(ids)
    }]);
    if (error) { alert(t('playlist_save_fail')); return; }
    alert(t('playlist_saved'));
    await loadSavedPlaylists();
}

let activePlaylistFilter = null;

function loadPlaylist(value) {
    const sel = document.getElementById('playlistSelect');
    if (value === '__manage__') {
        sel.value = '';
        managePlaylistDelete();
        return;
    }
    if (value === '' || value === null) {
        if (activePlaylistFilter) {
            activePlaylistFilter = null;
            render();
        }
        return;
    }
    const pl = savedPlaylists[parseInt(value)];
    if (!pl) return;
    activePlaylistFilter = new Set(JSON.parse(pl.play_ids));
    render();
    if (currentData.length > 0) playIndex(0);
    sel.value = '';
}

async function managePlaylistDelete() {
    if (savedPlaylists.length === 0) return;
    const names = savedPlaylists.map((pl, i) => `${i + 1}. ${pl.name}`).join('\n');
    const choice = prompt((currentLang === 'ja' ? '削除する番号を入力:\n' : 'Enter number to delete:\n') + names);
    if (!choice) return;
    const idx = parseInt(choice) - 1;
    if (isNaN(idx) || idx < 0 || idx >= savedPlaylists.length) return;
    const pl = savedPlaylists[idx];
    await supabaseClient.from('playlists').delete().eq('id', pl.id);
    alert(t('playlist_deleted'));
    await loadSavedPlaylists();
}

// --- タグ管理 ---
let mtDraftTags = [];

function openHighlightSettings() {
    const existing = document.getElementById('hl-modal');
    if (existing) existing.remove();

    const m = document.createElement('div');
    m.id = 'hl-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    m.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:28px;width:90%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.25)">
            <h3 style="margin:0 0 6px;font-size:1.1rem;font-weight:700">${t('hl_title')}</h3>
            <p style="margin:0 0 16px;font-size:0.82rem;color:#8b91a0">${t('hl_desc')}</p>
            <div style="margin-bottom:14px">
                <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;font-weight:600;margin-bottom:4px;cursor:pointer">
                    <input type="checkbox" id="hl-enable-rally-sec" ${HIGHLIGHT_CONFIG.enableRallySec ? 'checked' : ''}> ${t('hl_rally_sec_label')}
                </label>
                <input type="number" id="hl-rally-sec" min="0" step="1" value="${HIGHLIGHT_CONFIG.minRallySec}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:0.9rem;box-sizing:border-box">
            </div>
            <div style="margin-bottom:14px">
                <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;font-weight:600;margin-bottom:4px;cursor:pointer">
                    <input type="checkbox" id="hl-enable-close-score" ${HIGHLIGHT_CONFIG.enableCloseScore ? 'checked' : ''}> ${t('hl_score_section_label')}
                </label>
                <div style="display:flex;gap:8px">
                    <div style="flex:1">
                        <label style="display:block;font-size:0.78rem;color:#8b91a0;margin-bottom:4px">${t('hl_min_points_label')}</label>
                        <input type="number" id="hl-min-points" min="0" step="1" value="${HIGHLIGHT_CONFIG.breakMinTotalPoints}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:0.9rem;box-sizing:border-box">
                    </div>
                    <div style="flex:1">
                        <label style="display:block;font-size:0.78rem;color:#8b91a0;margin-bottom:4px">${t('hl_max_diff_label')}</label>
                        <input type="number" id="hl-max-diff" min="0" step="1" value="${HIGHLIGHT_CONFIG.breakMaxDiff}" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:0.9rem;box-sizing:border-box">
                    </div>
                </div>
            </div>
            <div style="margin-bottom:18px">
                <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;margin-bottom:6px;cursor:pointer"><input type="radio" name="hl-scope" id="hl-scope-break" ${HIGHLIGHT_CONFIG.breakOnly ? 'checked' : ''}> ${t('hl_scope_break')}</label>
                <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer"><input type="radio" name="hl-scope" id="hl-scope-all" ${!HIGHLIGHT_CONFIG.breakOnly ? 'checked' : ''}> ${t('hl_scope_all')}</label>
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end">
                <button id="hl-cancel" style="padding:10px 18px;border:1px solid #ddd;border-radius:8px;background:none;font-weight:600;cursor:pointer">${t('cancel')}</button>
                <button id="hl-submit" style="padding:10px 18px;border:none;border-radius:8px;background:#4f6ef7;color:#fff;font-weight:700;cursor:pointer">${t('mt_save')}</button>
            </div>
        </div>`;
    document.body.appendChild(m);

    m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
    document.getElementById('hl-cancel').onclick = () => m.remove();
    document.getElementById('hl-submit').onclick = () => submitHighlightSettings(m);
}

function submitHighlightSettings(modal) {
    const sec = parseFloat(document.getElementById('hl-rally-sec').value);
    const pts = parseInt(document.getElementById('hl-min-points').value);
    const diff = parseInt(document.getElementById('hl-max-diff').value);

    if (!isNaN(sec)) HIGHLIGHT_CONFIG.minRallySec = sec;
    if (!isNaN(pts)) HIGHLIGHT_CONFIG.breakMinTotalPoints = pts;
    if (!isNaN(diff)) HIGHLIGHT_CONFIG.breakMaxDiff = diff;
    HIGHLIGHT_CONFIG.breakOnly = document.getElementById('hl-scope-break').checked;
    HIGHLIGHT_CONFIG.enableRallySec = document.getElementById('hl-enable-rally-sec').checked;
    HIGHLIGHT_CONFIG.enableCloseScore = document.getElementById('hl-enable-close-score').checked;

    try { localStorage.setItem(`ss_highlight_config_${MY_TEAM_CODE}`, JSON.stringify(HIGHLIGHT_CONFIG)); } catch (e) {}

    computeHighlightCandidates(rallies);
    render();
    modal.remove();
}

function openManageTags() {
    const existing = document.getElementById('mt-modal');
    if (existing) existing.remove();

    mtDraftTags = [...starterTags];

    const m = document.createElement('div');
    m.id = 'mt-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    m.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:28px;width:90%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.25)">
            <h3 style="margin:0 0 6px;font-size:1.1rem;font-weight:700">${t('mt_title')}</h3>
            <p style="margin:0 0 16px;font-size:0.82rem;color:#8b91a0">${t('mt_desc')}</p>
            <div id="mt-chip-list" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;min-height:32px"></div>
            <div style="display:flex;gap:8px;margin-bottom:8px">
                <input type="text" id="mt-new-tag" placeholder="${t('mt_add_placeholder')}" style="flex:1;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:0.9rem;box-sizing:border-box">
                <button id="mt-add-btn" style="padding:10px 16px;border:none;border-radius:8px;background:#eef1ff;color:#4f6ef7;font-weight:700;cursor:pointer">${t('mt_add_btn')}</button>
            </div>
            <div id="mt-msg" style="margin:4px 0 14px;font-size:0.82rem;text-align:center;min-height:1.2em"></div>
            <div style="display:flex;gap:8px;justify-content:space-between">
                <button id="mt-reset" style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;background:none;font-weight:600;cursor:pointer;font-size:0.82rem">${t('mt_reset')}</button>
                <div style="display:flex;gap:8px">
                    <button id="mt-cancel" style="padding:10px 18px;border:1px solid #ddd;border-radius:8px;background:none;font-weight:600;cursor:pointer">${t('cancel')}</button>
                    <button id="mt-submit" style="padding:10px 18px;border:none;border-radius:8px;background:#4f6ef7;color:#fff;font-weight:700;cursor:pointer">${t('mt_save')}</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(m);

    renderMtChips();

    m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
    document.getElementById('mt-cancel').onclick = () => m.remove();
    document.getElementById('mt-add-btn').onclick = mtAddTag;
    document.getElementById('mt-new-tag').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); mtAddTag(); } });
    document.getElementById('mt-reset').onclick = () => { mtDraftTags = [...DEFAULT_TAGS]; renderMtChips(); };
    document.getElementById('mt-submit').onclick = submitManageTags;
}

function renderMtChips() {
    const list = document.getElementById('mt-chip-list');
    list.innerHTML = mtDraftTags.map((tg, i) => `
        <span style="display:inline-flex;align-items:center;gap:6px;background:#f0f2f5;border-radius:16px;padding:6px 10px;font-size:0.85rem;font-weight:600">
            ${escapeHtml(tg)}
            <span onclick="mtRemoveTag(${i})" style="cursor:pointer;color:#8b91a0;font-weight:700">✕</span>
        </span>`).join('');
}

function mtAddTag() {
    const input = document.getElementById('mt-new-tag');
    const msg = document.getElementById('mt-msg');
    msg.style.color = '#e53935';
    let val = input.value.trim();
    if (!val) return;
    if (!val.startsWith('#')) val = '#' + val;
    if (mtDraftTags.some(tg => tg.toLowerCase() === val.toLowerCase())) { msg.textContent = t('mt_duplicate'); return; }
    mtDraftTags.push(val);
    input.value = '';
    msg.textContent = '';
    renderMtChips();
}

function mtRemoveTag(i) {
    mtDraftTags.splice(i, 1);
    renderMtChips();
}

async function submitManageTags() {
    const msg = document.getElementById('mt-msg');
    const btn = document.getElementById('mt-submit');
    msg.style.color = '#e53935';
    if (mtDraftTags.length === 0) { msg.textContent = t('mt_empty'); return; }

    btn.disabled = true;
    const { error } = await supabaseClient.from('team_tags').upsert([{ id: 1, tags: mtDraftTags }], { onConflict: 'id' });
    btn.disabled = false;

    if (error) { msg.style.color = '#e53935'; msg.textContent = t('mt_save_fail'); return; }
    starterTags = [...mtDraftTags];
    msg.style.color = '#2e7d32';
    msg.textContent = t('mt_save_success');
    setTimeout(() => { document.getElementById('mt-modal')?.remove(); }, 900);
}

// --- 試合削除 ---
async function editMatchCategory() {
    if (!currentMatchDVW) return;
    const match = allMatchData.find(m => m.dvw === currentMatchDVW);
    const currentCat = match ? match.cat : '';
    const existing = catList.filter(c => c !== 'All');
    const hint = existing.length > 0 ? `\n(${existing.join(', ')})` : '';
    const newCat = prompt(t('edit_category_prompt') + hint, currentCat);
    if (!newCat || !newCat.trim() || newCat.trim() === currentCat) return;
    const { error } = await supabaseClient.from('matches').update({ category: newCat.trim() }).eq('dvw_url', currentMatchDVW);
    if (error) { alert(t('edit_category_fail')); return; }
    alert(t('edit_category_success'));
    fetchMatchList();
}

async function deleteMatch() {
    if (!currentMatchDVW) return;
    const sel = document.getElementById('matchSelect');
    const matchName = sel.options[sel.selectedIndex]?.text || currentMatchDVW;

    const input = prompt(t('delete_confirm_prompt', { name: matchName }));
    if (input !== 'DELETE') return;

    const btn = document.getElementById('menu-delete-match');
    btn.disabled = true; btn.style.opacity = '0.5';

    try {
        const filePath = new URL(currentMatchDVW).pathname.split('/dvw_files/')[1];
        await Promise.all([
            supabaseClient.storage.from('dvw_files').remove([filePath]),
            supabaseClient.from('comments').delete().eq('match_dvw', currentMatchDVW),
            supabaseClient.from('drawings').delete().eq('match_dvw', currentMatchDVW),
            supabaseClient.from('playlists').delete().eq('match_dvw', currentMatchDVW),
            supabaseClient.from('matches').delete().eq('dvw_url', currentMatchDVW)
        ]);
        alert(t('deleted'));
        currentMatchDVW = '';
        btn.style.display = 'none';
        fetchMatchList();
    } catch(e) {
        console.error(e);
        alert(t('delete_fail') + e.message);
    } finally {
        btn.disabled = false; btn.style.opacity = '1';
    }
}

// Mobile keyboard: hide video area while editing comments
function isMobilePortrait() {
    return window.innerWidth <= 768 && window.matchMedia('(orientation: portrait)').matches;
}

let kbAlignHandler = null;
let kbAlignCard = null;

function alignCardAboveKeyboard() {
    const scroller = document.getElementById('control-side');
    const vv = window.visualViewport;
    if (!scroller || !vv || !kbAlignCard) return;
    const keyboardTop = vv.height + vv.offsetTop;
    const delta = kbAlignCard.getBoundingClientRect().bottom - keyboardTop;
    if (Math.abs(delta) > 1) scroller.scrollTop += delta;
}

document.addEventListener('focusin', (e) => {
    if (e.target.matches('.comment-input, .search-input')) {
        clearInterval(checkInterval);
        if (isMobilePortrait()) {
            const vid = document.getElementById('video-side');
            const scroller = document.getElementById('control-side');
            if (vid && vid.style.display !== 'none') {
                const collapsedHeight = vid.offsetHeight;
                vid.style.display = 'none';
                if (scroller) {
                    scroller.style.paddingBottom = '50vh';
                    scroller.scrollTop += collapsedHeight;
                }

                if (window.visualViewport) {
                    kbAlignCard = e.target.closest('.instance-btn') || e.target;
                    kbAlignHandler = alignCardAboveKeyboard;
                    window.visualViewport.addEventListener('resize', kbAlignHandler);
                    window.visualViewport.addEventListener('scroll', kbAlignHandler);
                    setTimeout(alignCardAboveKeyboard, 350);
                } else {
                    setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 350);
                }
            }
        }
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target.matches('.comment-input, .search-input')) {
        const autoNextCb = document.getElementById('autoNext');
        if (autoNextCb && autoNextCb.checked && player && player.getPlayerState && player.getPlayerState() === 1) {
            startTracking();
        }
        if (kbAlignHandler && window.visualViewport) {
            window.visualViewport.removeEventListener('resize', kbAlignHandler);
            window.visualViewport.removeEventListener('scroll', kbAlignHandler);
            kbAlignHandler = null;
            kbAlignCard = null;
        }
        if (isMobilePortrait()) {
            const vid = document.getElementById('video-side');
            const scroller = document.getElementById('control-side');
            if (vid) vid.style.display = '';
            if (scroller) scroller.style.paddingBottom = '';
        }
    }
});

// ── Video Zoom (mobile only) ──
(function() {
    if (!('ontouchstart' in window)) return;

    const videoSide = document.getElementById('video-side');
    const playerBox = document.getElementById('player-box');
    const zoomSlider = document.getElementById('zoom-level');
    const panSlider = document.getElementById('zoom-pan');
    const zoomValue = document.getElementById('zoom-value');
    const panRow = document.getElementById('zoom-pan-row');
    let scale = 1, panX = 0, panY = 0;
    let dragging = false, lastTouchX = 0, lastTouchY = 0;
    let pinching = false, initialPinchDist = 0, pinchStartScale = 1;

    function applyZoom() {
        const maxPanX = (scale - 1) / 2;
        const maxPanY = (scale - 1) / 2;
        panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
        panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
        const pctX = 50 - panX * 100;
        const pctY = 50 - panY * 100;
        playerBox.style.transformOrigin = pctX + '% ' + pctY + '%';
        playerBox.style.transform = 'scale(' + scale + ')';
        zoomSlider.value = scale;
        zoomValue.textContent = scale.toFixed(1) + 'x';
        panRow.style.display = scale > 1 ? 'flex' : 'none';
        const maxP = maxPanX || 1;
        panSlider.value = panX / maxP;
    }

    zoomSlider.addEventListener('input', function() {
        scale = parseFloat(this.value);
        zoomValue.textContent = scale.toFixed(1) + 'x';
        panRow.style.display = scale > 1 ? 'flex' : 'none';
        if (scale <= 1) { panX = 0; panY = 0; }
        applyZoom();
    });

    panSlider.addEventListener('input', function() {
        const maxPanX = (scale - 1) / 2;
        panX = parseFloat(this.value) * maxPanX;
        applyZoom();
    });

    function pinchDist(e) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.hypot(dx, dy);
    }

    videoSide.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            pinching = true;
            dragging = false;
            initialPinchDist = pinchDist(e);
            pinchStartScale = scale;
        } else if (e.touches.length === 1 && scale > 1) {
            dragging = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }
    }, { passive: true });

    videoSide.addEventListener('touchmove', function(e) {
        if (pinching && e.touches.length === 2) {
            const dist = pinchDist(e);
            scale = Math.min(2, Math.max(1, pinchStartScale * (dist / initialPinchDist)));
            if (scale <= 1) { panX = 0; panY = 0; }
            applyZoom();
            return;
        }
        if (dragging && e.touches.length === 1 && scale > 1) {
            const dx = (e.touches[0].clientX - lastTouchX) / playerBox.offsetWidth;
            const dy = (e.touches[0].clientY - lastTouchY) / playerBox.offsetHeight;
            panX += dx;
            panY += dy;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
            applyZoom();
        }
    }, { passive: true });

    videoSide.addEventListener('touchend', function(e) {
        if (e.touches.length < 2) pinching = false;
        if (e.touches.length === 0) dragging = false;
    }, { passive: true });
})();

function resetZoom() {
    const zoomSlider = document.getElementById('zoom-level');
    const panSlider = document.getElementById('zoom-pan');
    const zoomValue = document.getElementById('zoom-value');
    const panRow = document.getElementById('zoom-pan-row');
    const playerBox = document.getElementById('player-box');
    zoomSlider.value = 1; panSlider.value = 0;
    zoomValue.textContent = '1.0x';
    panRow.style.display = 'none';
    playerBox.style.transform = '';
    playerBox.style.transformOrigin = '';
}

// 起動！
checkAuth();
