'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Target, 
  Activity, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit3,
  Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';

interface UserSettings {
  name: string;
  email: string;
  targetCalories: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  notifications: {
    mealReminders: boolean;
    dailyGoal: boolean;
    weeklyReport: boolean;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    name: user?.user_metadata?.name || '사용자',
    email: user?.email || 'user@example.com',
    targetCalories: 2000,
    height: 165,
    weight: 60,
    activityLevel: 'moderate',
    notifications: {
      mealReminders: true,
      dailyGoal: true,
      weeklyReport: false,
    }
  });

  const handleSave = () => {
    // TODO: 실제 API 연동 시 서버에 저장
    console.log('Settings saved:', settings);
    setEditMode(false);
  };

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const activityLevels = [
    { value: 'sedentary', label: '좌식 생활', description: '거의 운동하지 않음' },
    { value: 'light', label: '가벼운 활동', description: '주 1-3회 가벼운 운동' },
    { value: 'moderate', label: '보통 활동', description: '주 3-5회 적당한 운동' },
    { value: 'active', label: '활발한 활동', description: '주 6-7회 격한 운동' },
    { value: 'very_active', label: '매우 활발함', description: '매일 격한 운동 또는 육체적 직업' },
  ];

  const bmi = (settings.weight / Math.pow(settings.height / 100, 2)).toFixed(1);
  
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: '저체중', color: 'text-blue-400' };
    if (bmi < 25) return { status: '정상', color: 'text-green-400' };
    if (bmi < 30) return { status: '과체중', color: 'text-yellow-400' };
    return { status: '비만', color: 'text-red-400' };
  };

  const bmiStatus = getBMIStatus(parseFloat(bmi));

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-lavender/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-pink/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="glass"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">프로필</h1>
              <p className="text-white/70">개인 정보 및 설정</p>
            </div>
          </div>

          <Button
            variant={editMode ? 'primary' : 'glass'}
            size="sm"
            onClick={() => editMode ? handleSave() : setEditMode(true)}
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                저장
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                편집
              </>
            )}
          </Button>
        </motion.div>

        {/* 프로필 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glassEffect="medium" className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink/30 to-lavender/30 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">이름</label>
                    {editMode ? (
                      <Input
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        placeholder="이름을 입력하세요"
                      />
                    ) : (
                      <p className="text-white font-medium">{settings.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">이메일</label>
                    <p className="text-white/80 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {settings.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 신체 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glassEffect="medium" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              신체 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">키 (cm)</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={settings.height}
                    onChange={(e) => setSettings({ ...settings, height: parseInt(e.target.value) })}
                    placeholder="키를 입력하세요"
                  />
                ) : (
                  <p className="text-white font-medium">{settings.height} cm</p>
                )}
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">몸무게 (kg)</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={settings.weight}
                    onChange={(e) => setSettings({ ...settings, weight: parseInt(e.target.value) })}
                    placeholder="몸무게를 입력하세요"
                  />
                ) : (
                  <p className="text-white font-medium">{settings.weight} kg</p>
                )}
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">BMI</label>
                <div className="flex items-center space-x-2">
                  <p className="text-white font-medium">{bmi}</p>
                  <span className={`text-sm ${bmiStatus.color}`}>({bmiStatus.status})</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 목표 설정 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glassEffect="medium" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              목표 설정
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">하루 목표 칼로리</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={settings.targetCalories}
                    onChange={(e) => setSettings({ ...settings, targetCalories: parseInt(e.target.value) })}
                    placeholder="목표 칼로리를 입력하세요"
                  />
                ) : (
                  <p className="text-white font-medium">{settings.targetCalories} kcal</p>
                )}
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">활동 수준</label>
                {editMode ? (
                  <div className="space-y-2">
                    {activityLevels.map((level) => (
                      <label key={level.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value={level.value}
                          checked={settings.activityLevel === level.value}
                          onChange={(e) => setSettings({ 
                            ...settings, 
                            activityLevel: e.target.value as UserSettings['activityLevel']
                          })}
                          className="text-pink"
                        />
                        <div>
                          <p className="text-white font-medium">{level.label}</p>
                          <p className="text-white/60 text-sm">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium">
                      {activityLevels.find(l => l.value === settings.activityLevel)?.label}
                    </p>
                    <p className="text-white/60 text-sm">
                      {activityLevels.find(l => l.value === settings.activityLevel)?.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 알림 설정 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glassEffect="medium" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              알림 설정
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'mealReminders', label: '식사 알림', description: '식사 시간에 알림을 받습니다' },
                { key: 'dailyGoal', label: '일일 목표 알림', description: '목표 달성 현황을 알려줍니다' },
                { key: 'weeklyReport', label: '주간 리포트', description: '주간 식단 분석 리포트를 받습니다' },
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{notification.label}</p>
                    <p className="text-white/60 text-sm">{notification.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [notification.key]: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                      disabled={!editMode}
                    />
                    <div className="w-11 h-6 bg-gray-200/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink/50"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 추가 옵션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glassEffect="medium" className="p-6">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-white/70" />
                  <div className="text-left">
                    <p className="text-white font-medium">개인정보 보호</p>
                    <p className="text-white/60 text-sm">데이터 사용 및 보호 정책</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-white/40 rotate-180" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-white/70" />
                  <div className="text-left">
                    <p className="text-white font-medium">도움말 및 지원</p>
                    <p className="text-white/60 text-sm">사용법 및 문의사항</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-white/40 rotate-180" />
              </button>

              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <p className="text-red-400 font-medium">로그아웃</p>
                    <p className="text-white/60 text-sm">계정에서 로그아웃합니다</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-red-400 rotate-180" />
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 로그아웃 확인 모달 */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="로그아웃"
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <p className="text-white/80">정말 로그아웃하시겠습니까?</p>
          
          <div className="flex space-x-3">
            <Button
              variant="glass"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}